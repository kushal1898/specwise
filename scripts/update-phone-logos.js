const fs = require('fs');
const https = require('https');
const path = require('path');

const phonesPath = path.join(__dirname, '../data/phones.json');
const phones = require(phonesPath);

const brandMap = {
  "Apple": "Apple Inc.",
  "Samsung": "Samsung",
  "OnePlus": "OnePlus",
  "Google": "Google",
  "Nothing": "Nothing (technology company)",
  "Xiaomi": "Xiaomi",
  "Realme": "Realme",
  "Poco": "POCO (company)",
  "Moto": "Motorola Mobility",
  "Sony": "Sony",
  "ASUS": "Asus",
  "Honor": "Honor (brand)",
  "iQOO": "IQOO",
  "Tecno": "Tecno Mobile",
  "Nubia": "Nubia Technology",
  "Lava": "Lava International",
  "Infinix": "Infinix Mobile",
  "Micromax": "Micromax Informatics",
  "CMF": "Nothing (technology company)",
  "Redmi": "Redmi"
};

const brandImagesCache = {};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SpecWiseLogoUpdater/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getBrandLogo(brandName) {
  if (brandImagesCache[brandName] !== undefined) {
    return brandImagesCache[brandName];
  }

  const wikiTitle = brandMap[brandName] || brandName;
  try {
    const imgUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(wikiTitle) + '&prop=pageimages&format=json&pithumbsize=800';
    const imgData = await fetchJson(imgUrl);
    
    if (imgData && imgData.query && imgData.query.pages) {
      const pageId = Object.keys(imgData.query.pages)[0];
      const page = imgData.query.pages[pageId];
      if (page && page.thumbnail && page.thumbnail.source) {
        brandImagesCache[brandName] = page.thumbnail.source;
        return page.thumbnail.source;
      }
    }
  } catch (error) {
    console.error('Error fetching logo for', brandName, error.message);
  }
  
  brandImagesCache[brandName] = null;
  return null;
}

async function main() {
  const missingPhones = phones.filter(p => !p.image.startsWith('http'));
  console.log(`Found ${missingPhones.length} phones missing valid images.`);
  let updatedCount = 0;
  
  for (let i = 0; i < missingPhones.length; i++) {
    const phone = missingPhones[i];
    console.log(`Processing [${i+1}/${missingPhones.length}]: ${phone.name} (Brand: ${phone.brand})`);
    
    // Check if the brand name needs to be mapped to match "Moto" instead of full Motorola
    let searchBrand = phone.brand;
    if (phone.name.includes("Moto")) searchBrand = "Moto";
    if (phone.name.includes("Redmi")) searchBrand = "Redmi";
    if (phone.name.includes("Poco")) searchBrand = "Poco";
    if (phone.name.includes("ROG")) searchBrand = "ROG";
    if (phone.name.includes("Zenfone")) searchBrand = "ASUS";
    if (phone.name.includes("Xperia")) searchBrand = "Sony";
    if (phone.name.includes("CMF")) searchBrand = "CMF";

    const logoUrl = await getBrandLogo(searchBrand);
    if (logoUrl) {
      // Find and update original phone
      const originalPhone = phones.find(p => p.id === phone.id);
      originalPhone.image = logoUrl;
      updatedCount++;
      console.log(`  -> Applied logo: ${logoUrl.substring(0, 50)}...`);
    } else {
      console.log(`  -> No logo found on Wikipedia for ${searchBrand}.`);
    }
  }

  fs.writeFileSync(phonesPath, JSON.stringify(phones, null, 2));
  console.log(`\nSuccessfully updated ${updatedCount} phone images with company logos.`);
}

main();
