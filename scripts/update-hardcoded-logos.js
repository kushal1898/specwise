const fs = require('fs');
const path = require('path');

const phonesPath = path.join(__dirname, '../data/phones.json');
const phones = require(phonesPath);

// Hardcoded Wikimedia URLs for brands that didn't match easily in the previous script
const logoMap = {
  "OnePlus": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/OnePlus_logo.svg/800px-OnePlus_logo.svg.png",
  "Realme": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Realme_logo.svg/800px-Realme_logo.svg.png",
  "Oppo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/OPPO_Logo.svg/800px-OPPO_Logo.svg.png",
  "Vivo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Vivo_mobile_logo.svg/800px-Vivo_mobile_logo.svg.png",
  "Honor": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Honor_logo_2023.svg/800px-Honor_logo_2023.svg.png",
  "iQOO": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/IQOO_logo.svg/800px-IQOO_logo.svg.png",
  "Nubia": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nubia_logo_2020.svg/800px-Nubia_logo_2020.svg.png",
  "Infinix": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Infinix_logo.svg/800px-Infinix_logo.svg.png",
  "Nothing": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Nothing_Logo.svg/800px-Nothing_Logo.svg.png"
};

function main() {
  const missingPhones = phones.filter(p => !p.image.startsWith('http'));
  console.log(`Found ${missingPhones.length} phones still missing valid images.`);
  let updatedCount = 0;
  
  for (let i = 0; i < missingPhones.length; i++) {
    const phone = missingPhones[i];
    
    let searchBrand = phone.brand;
    if (logoMap[searchBrand]) {
      const originalPhone = phones.find(p => p.id === phone.id);
      originalPhone.image = logoMap[searchBrand];
      updatedCount++;
      console.log(`  -> Applied hardcoded logo for: ${searchBrand}`);
    }
  }

  fs.writeFileSync(phonesPath, JSON.stringify(phones, null, 2));
  console.log(`\nSuccessfully updated ${updatedCount} phone images with hardcoded company logos.`);
}

main();
