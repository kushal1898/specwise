const fs = require('fs');
const https = require('https');
const path = require('path');

const phonesPath = path.join(__dirname, '../data/phones.json');
const phones = require(phonesPath);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SpecWiseImageUpdater/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getWikiImage(queryName) {
  try {
    const searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(queryName) + '&utf8=&format=json';
    const searchResult = await fetchJson(searchUrl);
    
    if (searchResult.query && searchResult.query.search && searchResult.query.search.length > 0) {
      const pageId = searchResult.query.search[0].pageid;
      const imgUrl = 'https://en.wikipedia.org/w/api.php?action=query&pageids=' + pageId + '&prop=pageimages&format=json&pithumbsize=800';
      const imgData = await fetchJson(imgUrl);
      
      const page = imgData.query.pages[pageId];
      if (page && page.thumbnail && page.thumbnail.source) {
        return page.thumbnail.source;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching image for', queryName, error.message);
    return null;
  }
}

async function main() {
  console.log(`Found ${phones.length} phones to update.`);
  let updatedCount = 0;
  
  for (let i = 0; i < phones.length; i++) {
    const phone = phones[i];
    console.log(`Processing [${i+1}/${phones.length}]: ${phone.name}`);
    
    // Quick delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
    
    const imageUrl = await getWikiImage(phone.name);
    if (imageUrl) {
      phone.image = imageUrl;
      updatedCount++;
      console.log(`  -> Found image: ${imageUrl.substring(0, 50)}...`);
    } else {
      console.log(`  -> No image found on Wikipedia.`);
    }
  }

  fs.writeFileSync(phonesPath, JSON.stringify(phones, null, 2));
  console.log(`\nSuccessfully updated ${updatedCount} phone images.`);
}

main();
