const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const headphonesPath = path.join(__dirname, '../data/headphones.json');
const headphones = require(headphonesPath);

const outputDir = path.join(__dirname, '../public/images/headphones');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function searchBingImages(query) {
  return new Promise((resolve) => {
    const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(query) + '&form=HDRSC2';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find all main URLs
        const matches = [...data.matchAll(/murl&quot;:&quot;(.*?)&quot;/g)];
        if (matches && matches.length > 0) {
          resolve(matches.map(m => m[1]));
        } else {
          resolve([]);
        }
      });
      res.on('error', () => resolve([]));
    }).on('error', () => resolve([]));
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 }, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve(false);
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
      file.on('error', () => {
        fs.unlink(dest, () => {});
        resolve(false);
      });
    });
    
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}

async function main() {
  console.log('Downloading actual photos for ' + headphones.length + ' headphones...\n');
  
  let successCount = 0;
  
  for (let i = 0; i < headphones.length; i++) {
    const hp = headphones[i];
    const imagePath = `/images/headphones/${hp.id}.jpg`;
    const destPath = path.join(outputDir, `${hp.id}.jpg`);
    
    // Skip if already exists and is not a placeholder
    const fileExists = fs.existsSync(destPath) && fs.statSync(destPath).size > 5000;
    
    if (fileExists) {
      console.log(`[${i+1}/${headphones.length}] ${hp.id} - Already exists`);
      hp.image = imagePath;
      successCount++;
      continue;
    }

    const query = `${hp.brand} ${hp.name}`;
    console.log(`[${i+1}/${headphones.length}] Searching: ${query}`);
    
    const urls = await searchBingImages(query);
    let downloaded = false;
    
    for (let u = 0; u < Math.min(urls.length, 5); u++) {
      let url = urls[u];
      // Clean query string from image url if needed
      // Some urls might fail, so we iterate until one works
      if(url.includes('svg') || url.includes('gif')) continue; // prefer static photos
      
      const success = await downloadImage(url, destPath);
      if (success) {
        const stats = fs.statSync(destPath);
        if (stats.size > 2000) { // Valid image
          console.log(`  -> Downloaded from URL ${u+1}: ${url}`);
          hp.image = imagePath;
          downloaded = true;
          successCount++;
          break;
        } else {
          // File too small, delete it
          fs.unlinkSync(destPath);
        }
      }
    }
    
    if (!downloaded) {
      console.log(`  -> FAILED to download any image for ${hp.id}`);
    }
    
    // Save state after every download to not lose progress
    fs.writeFileSync(headphonesPath, JSON.stringify(headphones, null, 2));
    
    // Tiny wait
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n=== DONE ===`);
  console.log(`Successfully downloaded/verified ${successCount} out of ${headphones.length} images.`);
}

main();
