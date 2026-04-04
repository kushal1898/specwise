// Script to generate 100 phones with realistic data
const existingPhones = require('../data/phones.json');

const brands = [
  { name: "Apple", models: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone SE 4", "iPhone 14", "iPhone 14 Plus"] },
  { name: "Samsung", models: ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 FE", "Galaxy Z Fold 6", "Galaxy Z Flip 6", "Galaxy A54", "Galaxy A35", "Galaxy A25", "Galaxy A15", "Galaxy M55", "Galaxy F55"] },
  { name: "Google", models: ["Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 9a", "Pixel 8 Pro", "Pixel 8", "Pixel Fold 2"] },
  { name: "OnePlus", models: ["OnePlus 13", "OnePlus 13R", "OnePlus 12R", "OnePlus Nord 4", "OnePlus Nord CE 4", "OnePlus Open 2"] },
  { name: "Xiaomi", models: ["Xiaomi 15 Pro", "Xiaomi 15", "Xiaomi 14 Ultra", "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14", "Poco F6 Pro", "Poco F6", "Poco X6 Pro", "Poco M6 Pro"] },
  { name: "Nothing", models: ["Nothing Phone (3)", "Nothing Phone (2a) Plus", "Nothing Phone (2a)"] },
  { name: "Motorola", models: ["Moto Edge 50 Ultra", "Moto Edge 50 Pro", "Moto Edge 50 Fusion", "Moto G85", "Moto G75", "Moto Razr 50 Ultra", "Moto Razr 50"] },
  { name: "Oppo", models: ["Oppo Find X8 Pro", "Oppo Find X8", "Oppo Reno 12 Pro", "Oppo Reno 12", "Oppo A3 Pro", "Oppo A2 Pro"] },
  { name: "Vivo", models: ["Vivo X200 Pro", "Vivo X200", "Vivo V40 Pro", "Vivo V40", "Vivo T3 Ultra", "Vivo T3 Pro", "Vivo Y300 Pro"] },
  { name: "Realme", models: ["Realme GT 7 Pro", "Realme GT 6", "Realme 13 Pro+", "Realme 13 Pro", "Realme Narzo 70 Pro", "Realme C67"] },
  { name: "Sony", models: ["Xperia 1 VI", "Xperia 5 V", "Xperia 10 VI"] },
  { name: "ASUS", models: ["ROG Phone 9 Pro", "ROG Phone 9", "Zenfone 11 Ultra"] },
  { name: "Honor", models: ["Honor Magic 7 Pro", "Honor Magic V3", "Honor 200 Pro", "Honor 200", "Honor X9b"] },
];

const processors = {
  flagship: ["Snapdragon 8 Elite", "Snapdragon 8 Gen 3", "Apple A18 Pro", "Apple A18", "Google Tensor G4", "Dimensity 9400", "Exynos 2400"],
  midrange: ["Snapdragon 7+ Gen 3", "Snapdragon 7 Gen 3", "Dimensity 8300 Ultra", "Dimensity 8200", "Snapdragon 6 Gen 3", "Google Tensor G3", "Apple A16 Bionic"],
  budget: ["Dimensity 7300", "Snapdragon 6 Gen 1", "Dimensity 6300", "Helio G99 Ultra", "Exynos 1480", "Snapdragon 695"],
};

const categories = {
  flagship: ["flagship", "camera", "5g"],
  camera: ["camera", "5g"],
  gaming: ["gaming", "5g"],
  midrange: ["5g"],
  budget: ["5g", "battery"],
  foldable: ["foldable", "flagship", "5g"],
  compact: ["compact", "5g"],
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const allPhones = [...existingPhones];
const existingIds = new Set(allPhones.map(p => p.id));

for (const brand of brands) {
  for (const model of brand.models) {
    if (allPhones.length >= 100) break;
    
    const id = slugify(model);
    if (existingIds.has(id)) continue;
    
    const isFlagship = model.includes("Pro") || model.includes("Ultra") || model.includes("Max") || model.includes("Fold") || model.includes("ROG") || model.includes("Magic") || model.includes("Find");
    const isMidrange = model.includes("Nord") || model.includes("Reno") || model.includes("Edge") || model.includes("V40") || model.includes("Poco") || model.includes("GT") || model.includes("200");
    const isBudget = model.includes("A1") || model.includes("A2") || model.includes("A3") || model.includes("Redmi Note") || model.includes("Narzo") || model.includes("C6") || model.includes("Y3") || model.includes("M5") || model.includes("G75") || model.includes("G85") || model.includes("SE");
    const isFoldable = model.includes("Fold") || model.includes("Flip") || model.includes("Razr") || model.includes("Open") || model.includes("Magic V");
    const isCompact = model.includes("SE") || model.includes("mini") || (model.includes("Pixel 9") && !model.includes("XL"));
    
    let priceUsd, priceInr, score, cameraMp, batteryMah, displayInches, displayHz, ramGb, storageGb, proc, cat;
    
    if (isFoldable) {
      priceUsd = getRandomInt(999, 1999);
      priceInr = Math.round(priceUsd * 83);
      score = getRandomInt(82, 92);
      cameraMp = getRandomInt(48, 200);
      batteryMah = getRandomInt(4000, 5000);
      displayInches = getRandomInt(67, 80) / 10;
      displayHz = 120;
      ramGb = 12;
      storageGb = 256;
      proc = processors.flagship[getRandomInt(0, processors.flagship.length - 1)];
      cat = categories.foldable;
    } else if (isFlagship) {
      priceUsd = getRandomInt(699, 1399);
      priceInr = Math.round(priceUsd * 83);
      score = getRandomInt(85, 96);
      cameraMp = getRandomInt(48, 200);
      batteryMah = getRandomInt(4500, 6000);
      displayInches = getRandomInt(61, 69) / 10;
      displayHz = 120;
      ramGb = [8, 12, 16][getRandomInt(0, 2)];
      storageGb = [256, 512][getRandomInt(0, 1)];
      proc = processors.flagship[getRandomInt(0, processors.flagship.length - 1)];
      cat = categories.flagship;
    } else if (isMidrange) {
      priceUsd = getRandomInt(349, 699);
      priceInr = Math.round(priceUsd * 83);
      score = getRandomInt(78, 88);
      cameraMp = getRandomInt(50, 108);
      batteryMah = getRandomInt(4500, 5500);
      displayInches = getRandomInt(64, 68) / 10;
      displayHz = 120;
      ramGb = [8, 12][getRandomInt(0, 1)];
      storageGb = [128, 256][getRandomInt(0, 1)];
      proc = processors.midrange[getRandomInt(0, processors.midrange.length - 1)];
      cat = categories.midrange;
    } else {
      priceUsd = getRandomInt(149, 349);
      priceInr = Math.round(priceUsd * 83);
      score = getRandomInt(68, 80);
      cameraMp = getRandomInt(48, 64);
      batteryMah = getRandomInt(5000, 6000);
      displayInches = getRandomInt(64, 67) / 10;
      displayHz = [90, 120][getRandomInt(0, 1)];
      ramGb = [4, 6, 8][getRandomInt(0, 2)];
      storageGb = [64, 128][getRandomInt(0, 1)];
      proc = processors.budget[getRandomInt(0, processors.budget.length - 1)];
      cat = categories.budget;
    }
    
    const prosOptions = [
      "Excellent cameras", "Great battery life", "Fast charging", "Premium build quality",
      "Stunning display", "Smooth performance", "Clean software", "Good value",
      "5G connectivity", "IP68 water resistance", "Wireless charging", "Stereo speakers",
      "Long software updates", "Great haptics", "Compact size", "S Pen support",
      "Versatile cameras", "120Hz AMOLED", "Fast fingerprint sensor", "Great selfie camera",
      "Under-display camera", "Satellite connectivity", "AI features", "Titanium frame",
      "Hasselblad cameras", "Leica optics", "Zeiss optics", "Dolby Atmos speakers",
      "Expandable storage", "3.5mm headphone jack", "Large screen", "LTPO display",
    ];
    
    const consOptions = [
      "Expensive", "No charger in box", "Average battery", "Slow charging",
      "Bloatware", "No headphone jack", "Heavy", "Plastic build",
      "No wireless charging", "Limited availability", "Average cameras", "Old processor",
      "No IP rating", "No 5G", "Small battery", "Low resolution display",
      "Weak haptics", "No stereo speakers", "Large and bulky", "Curved display",
      "No expandable storage", "Short update support", "Gets warm", "Ads in UI",
    ];
    
    const verdicts = {
      flagship: `A premium ${brand.name} flagship with top-tier performance, excellent cameras, and a stunning display.`,
      midrange: `A solid mid-range offering from ${brand.name} that punches above its weight class with great specs for the price.`,
      budget: `An affordable ${brand.name} device that delivers solid everyday performance without breaking the bank.`,
      foldable: `${brand.name}'s innovative foldable device that combines cutting-edge design with powerful internals.`,
    };
    
    const tier = isFoldable ? 'foldable' : isFlagship ? 'flagship' : isMidrange ? 'midrange' : 'budget';
    
    // Pick random pros and cons
    const shuffledPros = prosOptions.sort(() => Math.random() - 0.5);
    const shuffledCons = consOptions.sort(() => Math.random() - 0.5);
    
    const resaleMultiplier6m = isFlagship ? 0.75 : isMidrange ? 0.65 : 0.55;
    const resaleMultiplier1y = isFlagship ? 0.60 : isMidrange ? 0.50 : 0.40;
    
    allPhones.push({
      id,
      name: model,
      brand: brand.name,
      price_inr: priceInr,
      price_usd: priceUsd,
      category: cat,
      image: `/images/phones/${id}.jpg`,
      score,
      processor: proc,
      camera_mp: cameraMp,
      battery_mah: batteryMah,
      display_inches: displayInches,
      display_hz: displayHz,
      ram_gb: ramGb,
      storage_gb: storageGb,
      youtube_review_url: `https://youtube.com/watch?v=${id}`,
      verdict: verdicts[tier],
      pros: shuffledPros.slice(0, getRandomInt(3, 4)),
      cons: shuffledCons.slice(0, getRandomInt(2, 3)),
      resale_value_6m: Math.round(priceUsd * resaleMultiplier6m),
      resale_value_1y: Math.round(priceUsd * resaleMultiplier1y),
    });
  }
}

// Ensure exactly 100
const finalPhones = allPhones.slice(0, 100);

// Add resale values to existing phones that don't have them
for (const phone of finalPhones) {
  if (!phone.resale_value_6m) {
    phone.resale_value_6m = Math.round(phone.price_usd * 0.70);
    phone.resale_value_1y = Math.round(phone.price_usd * 0.55);
  }
}

const fs = require('fs');
fs.writeFileSync('./data/phones.json', JSON.stringify(finalPhones, null, 2));
console.log(`Generated ${finalPhones.length} phones`);
