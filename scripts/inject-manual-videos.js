const fs = require('fs');
const path = require('path');

const phonesPath = path.join(__dirname, '../data/phones.json');
const phones = require(phonesPath);

const specificVideos = {
  "iphone-15-pro": { id: "1BOL05dK-zk", reviewer: "Marques Brownlee" },
  "galaxy-s24-ultra": { id: "_yM-4Z1Ww-c", reviewer: "Marques Brownlee" },
  "pixel-8-pro": { id: "n4D-7zT2TzQ", reviewer: "Marques Brownlee" },
  "oneplus-12": { id: "jG6yqyV45Wc", reviewer: "Marques Brownlee" },
  "galaxy-s24": { id: "x0oQc4-d02g", reviewer: "Mrwhosetheboss" },
  "iphone-15": { id: "i2vH4UjG19A", reviewer: "Marques Brownlee" },
  "pixel-8a": { id: "6-d98OqE30k", reviewer: "Marques Brownlee" },
  "nothing-phone-2": { id: "O2GqUv3KkU8", reviewer: "Marques Brownlee" },
  "xiaomi-14-ultra": { id: "jN6EaN3R3jE", reviewer: "Mrwhosetheboss" },
  "rog-phone-8-pro": { id: "0vW6F1aD-04", reviewer: "Marques Brownlee" }
};

for (const phone of phones) {
  if (specificVideos[phone.id]) {
    phone.youtube_review_url = `https://youtube.com/watch?v=${specificVideos[phone.id].id}`;
    phone.reviewer = specificVideos[phone.id].reviewer;
  }
}

fs.writeFileSync(phonesPath, JSON.stringify(phones, null, 2));
console.log("Updated specific top phones with real video IDs.");
