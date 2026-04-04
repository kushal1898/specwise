const https = require('https');
const fs = require('fs');
const path = require('path');

const phonesPath = path.join(__dirname, '../data/phones.json');
const phones = require(phonesPath);

function searchYouTube(query) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const match = data.match(/var ytInitialData = ({.*?});<\/script>/s);
          if (!match) { resolve(null); return; }
          
          const ytData = JSON.parse(match[1]);
          const contents = ytData.contents
            ?.twoColumnSearchResultsRenderer
            ?.primaryContents
            ?.sectionListRenderer
            ?.contents;
          
          if (!contents) { resolve(null); return; }
          
          for (const section of contents) {
            const items = section.itemSectionRenderer?.contents;
            if (!items) continue;
            
            for (const item of items) {
              const video = item.videoRenderer;
              if (!video) continue;
              
              const videoId = video.videoId;
              const title = video.title?.runs?.[0]?.text || '';
              const channel = video.ownerText?.runs?.[0]?.text || '';
              const lengthText = video.lengthText?.simpleText || '';
              
              if (!lengthText) continue;
              const parts = lengthText.split(':');
              let totalSeconds = 0;
              if (parts.length === 3) totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
              else if (parts.length === 2) totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
              
              // Skip shorts (under 3 minutes)
              if (totalSeconds < 180) continue;
              
              return resolve({ videoId, title, channel, length: lengthText });
            }
          }
          resolve(null);
        } catch (e) { resolve(null); }
      });
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
  });
}

function verifyVideo(videoId) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + videoId + '&format=json';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function main() {
  // Find phones that still have invalid video IDs (phones 83-97 weren't processed)
  const phonesToFix = [];
  
  for (let i = 0; i < phones.length; i++) {
    const phone = phones[i];
    const match = phone.youtube_review_url.match(/v=([a-zA-Z0-9_-]{11})/);
    if (!match) {
      phonesToFix.push(i);
      continue;
    }
    
    // Quick verify
    const valid = await verifyVideo(match[1]);
    if (!valid) phonesToFix.push(i);
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('Found ' + phonesToFix.length + ' phones with invalid/missing videos.\n');
  
  for (const idx of phonesToFix) {
    const phone = phones[idx];
    let searchName = phone.name;
    if (searchName.startsWith(phone.brand)) {
      searchName = searchName.substring(phone.brand.length).trim();
    }
    
    // Simple search: just the phone name + "review"
    const query = phone.brand + ' ' + searchName + ' review';
    console.log('[' + (idx+1) + '] Searching: ' + query);
    
    const result = await searchYouTube(query);
    if (result) {
      const valid = await verifyVideo(result.videoId);
      if (valid) {
        phone.youtube_review_url = 'https://www.youtube.com/watch?v=' + result.videoId;
        phone.reviewer = result.channel;
        console.log('  -> Found: "' + result.title + '" by ' + result.channel + ' (' + result.length + ')');
      } else {
        console.log('  -> Video found but not embeddable, trying next...');
      }
    } else {
      console.log('  -> No result found');
    }
    
    await new Promise(r => setTimeout(r, 1500));
  }
  
  fs.writeFileSync(phonesPath, JSON.stringify(phones, null, 2));
  console.log('\nDone! Data saved.');
}

main();
