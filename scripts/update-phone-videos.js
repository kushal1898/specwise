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
          // Extract ytInitialData from the page
          const match = data.match(/var ytInitialData = ({.*?});<\/script>/s);
          if (!match) {
            resolve(null);
            return;
          }
          
          const ytData = JSON.parse(match[1]);
          const contents = ytData.contents
            ?.twoColumnSearchResultsRenderer
            ?.primaryContents
            ?.sectionListRenderer
            ?.contents;
          
          if (!contents) {
            resolve(null);
            return;
          }
          
          // Find video results
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
              
              // Skip shorts (under 1 minute) and non-review content
              if (!lengthText) continue; // Shorts have no length shown
              const parts = lengthText.split(':');
              let totalSeconds = 0;
              if (parts.length === 3) {
                totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
              } else if (parts.length === 2) {
                totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
              }
              
              // Skip videos under 3 minutes (likely shorts/teasers)
              if (totalSeconds < 180) continue;
              
              return resolve({ videoId, title, channel, length: lengthText });
            }
          }
          
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
  });
}

function verifyVideo(videoId) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + videoId + '&format=json';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(res.statusCode === 200);
      });
      res.on('error', () => resolve(false));
    }).on('error', () => resolve(false));
  });
}

async function main() {
  console.log('Searching YouTube for review videos for ' + phones.length + ' phones...\n');
  
  let updatedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < phones.length; i++) {
    const phone = phones[i];
    const brandName = phone.brand;
    const phoneName = phone.name;
    
    // Clean up duplicate brand names like "Samsung Samsung Galaxy"
    let searchName = phoneName;
    if (searchName.startsWith(brandName)) {
      searchName = searchName.substring(brandName.length).trim();
    }
    
    // Try multiple search queries in order of preference
    const queries = [
      brandName + ' ' + searchName + ' review MKBHD',
      brandName + ' ' + searchName + ' review Mrwhosetheboss',
      brandName + ' ' + searchName + ' review',
    ];
    
    let found = false;
    
    for (const query of queries) {
      console.log('[' + (i+1) + '/' + phones.length + '] Searching: ' + query);
      
      const result = await searchYouTube(query);
      
      if (result) {
        // Verify the video is actually playable
        const isValid = await verifyVideo(result.videoId);
        
        if (isValid) {
          phone.youtube_review_url = 'https://www.youtube.com/watch?v=' + result.videoId;
          phone.reviewer = result.channel;
          console.log('  -> Found: "' + result.title + '" by ' + result.channel + ' (' + result.length + ')');
          updatedCount++;
          found = true;
          break;
        }
      }
      
      // Delay between queries
      await new Promise(r => setTimeout(r, 1000));
    }
    
    if (!found) {
      console.log('  -> FAILED to find valid video');
      failedCount++;
    }
    
    // Delay between phones to avoid rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }
  
  // Save updated data
  fs.writeFileSync(phonesPath, JSON.stringify(phones, null, 2));
  
  console.log('\n=== COMPLETE ===');
  console.log('Updated: ' + updatedCount);
  console.log('Failed: ' + failedCount);
  console.log('Data saved to phones.json');
}

main();
