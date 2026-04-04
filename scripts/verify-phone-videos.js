const https = require('https');
const fs = require('fs');
const path = require('path');

const phonesPath = path.join(__dirname, '../data/phones.json');
const phones = require(phonesPath);

function checkOEmbed(videoId) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + videoId + '&format=json';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({ valid: true, title: json.title, author: json.author_name });
          } catch(e) {
            resolve({ valid: false });
          }
        } else {
          resolve({ valid: false });
        }
      });
      res.on('error', () => resolve({ valid: false }));
    }).on('error', () => resolve({ valid: false }));
  });
}

async function main() {
  console.log('Verifying ' + phones.length + ' phone video IDs...\n');
  
  let validCount = 0;
  let invalidCount = 0;
  const invalidPhones = [];
  
  for (let i = 0; i < phones.length; i++) {
    const phone = phones[i];
    const match = phone.youtube_review_url.match(/v=([a-zA-Z0-9_-]+)/);
    const videoId = match ? match[1] : null;
    
    if (!videoId || videoId.startsWith('phone') || videoId === 'placeholder') {
      console.log('[' + (i+1) + '] ' + phone.id + ' -> PLACEHOLDER (needs replacement)');
      invalidPhones.push({ index: i, phone: phone });
      invalidCount++;
      continue;
    }
    
    const result = await checkOEmbed(videoId);
    
    if (result.valid) {
      console.log('[' + (i+1) + '] ' + phone.id + ' -> VALID: "' + result.title + '" by ' + result.author);
      validCount++;
    } else {
      console.log('[' + (i+1) + '] ' + phone.id + ' -> INVALID (ID: ' + videoId + ')');
      invalidPhones.push({ index: i, phone: phone, videoId: videoId });
      invalidCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Valid: ' + validCount);
  console.log('Invalid/Placeholder: ' + invalidCount);
  console.log('\nInvalid phone IDs:');
  invalidPhones.forEach(function(item) {
    console.log('  - ' + item.phone.id + ' (' + item.phone.brand + ' ' + item.phone.name + ')');
  });
}

main();
