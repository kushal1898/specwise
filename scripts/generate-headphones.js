const existingHeadphones = require('../data/headphones.json');
const fs = require('fs');

const newHeadphones = [
  // IEMs
  {id:"moondrop-blessing-3",name:"Moondrop Blessing 3",brand:"Moondrop",type:"IEM",driver:"Hybrid",price_usd:339,price_inr:27900,signature:"Neutral",score:91,impedance_ohm:22,sensitivity_db:118},
  {id:"moondrop-chu-2",name:"Moondrop Chu 2",brand:"Moondrop",type:"IEM",driver:"Dynamic",price_usd:25,price_inr:2100,signature:"Neutral-Warm",score:78,impedance_ohm:28,sensitivity_db:120},
  {id:"truthear-zero-red",name:"Truthear Zero:RED",brand:"Truthear",type:"IEM",driver:"Hybrid",price_usd:55,price_inr:4500,signature:"Neutral-Warm",score:83,impedance_ohm:14,sensitivity_db:112},
  {id:"truthear-nova",name:"Truthear Nova",brand:"Truthear",type:"IEM",driver:"Hybrid",price_usd:239,price_inr:19700,signature:"Neutral",score:90,impedance_ohm:8,sensitivity_db:108},
  {id:"7hz-timeless-ae",name:"7Hz Timeless AE",brand:"7Hz",type:"IEM",driver:"Planar",price_usd:219,price_inr:18000,signature:"Neutral",score:87,impedance_ohm:14,sensitivity_db:104},
  {id:"simgot-ea500lm",name:"Simgot EA500LM",brand:"Simgot",type:"IEM",driver:"Dynamic",price_usd:69,price_inr:5700,signature:"Warm",score:84,impedance_ohm:18,sensitivity_db:126},
  {id:"tangzu-wan-er",name:"Tangzu Wan'er SG",brand:"Tangzu",type:"IEM",driver:"Dynamic",price_usd:20,price_inr:1650,signature:"Neutral-Warm",score:79,impedance_ohm:24,sensitivity_db:112},
  {id:"kz-zst-x",name:"KZ ZST X",brand:"KZ",type:"IEM",driver:"Hybrid",price_usd:18,price_inr:1500,signature:"V-Shaped",score:72,impedance_ohm:12,sensitivity_db:111},
  {id:"sennheiser-ie-200",name:"Sennheiser IE 200",brand:"Sennheiser",type:"IEM",driver:"Dynamic",price_usd:149,price_inr:12290,signature:"Neutral",score:88,impedance_ohm:18,sensitivity_db:123},
  {id:"sennheiser-ie-300",name:"Sennheiser IE 300",brand:"Sennheiser",type:"IEM",driver:"Dynamic",price_usd:299,price_inr:24690,signature:"Neutral-Warm",score:90,impedance_ohm:16,sensitivity_db:124},
  {id:"shure-se846",name:"Shure SE846",brand:"Shure",type:"IEM",driver:"Balanced Armature",price_usd:899,price_inr:74000,signature:"Warm",score:92,impedance_ohm:9,sensitivity_db:114},
  {id:"shure-se215",name:"Shure SE215",brand:"Shure",type:"IEM",driver:"Dynamic",price_usd:99,price_inr:8100,signature:"Warm",score:80,impedance_ohm:17,sensitivity_db:107},
  {id:"shure-aonic-5",name:"Shure AONIC 5",brand:"Shure",type:"IEM",driver:"Balanced Armature",price_usd:449,price_inr:36990,signature:"Neutral",score:89,impedance_ohm:36,sensitivity_db:112},
  {id:"campfire-andromeda-2023",name:"Campfire Andromeda 2023",brand:"Campfire Audio",type:"IEM",driver:"Balanced Armature",price_usd:999,price_inr:82000,signature:"Bright",score:94,impedance_ohm:12,sensitivity_db:112},
  {id:"campfire-honeydew",name:"Campfire Honeydew",brand:"Campfire Audio",type:"IEM",driver:"Dynamic",price_usd:249,price_inr:20500,signature:"Warm",score:83,impedance_ohm:17,sensitivity_db:113},
  {id:"dunu-vulkan",name:"Dunu Vulkan",brand:"Dunu",type:"IEM",driver:"Hybrid",price_usd:379,price_inr:31200,signature:"Neutral-Warm",score:90,impedance_ohm:14,sensitivity_db:110},
  {id:"tin-hifi-t3-plus",name:"Tin HiFi T3 Plus",brand:"Tin HiFi",type:"IEM",driver:"Dynamic",price_usd:69,price_inr:5700,signature:"Neutral-Warm",score:82,impedance_ohm:32,sensitivity_db:104},
  {id:"etymotic-er2xr",name:"Etymotic ER2XR",brand:"Etymotic",type:"IEM",driver:"Dynamic",price_usd:169,price_inr:13900,signature:"Neutral-Warm",score:87,impedance_ohm:15,sensitivity_db:96},
  {id:"etymotic-er4xr",name:"Etymotic ER4XR",brand:"Etymotic",type:"IEM",driver:"Balanced Armature",price_usd:349,price_inr:28700,signature:"Neutral",score:91,impedance_ohm:45,sensitivity_db:98},
  {id:"fiio-fd5",name:"FiiO FD5",brand:"FiiO",type:"IEM",driver:"Dynamic",price_usd:299,price_inr:24600,signature:"V-Shaped",score:86,impedance_ohm:32,sensitivity_db:109},
  {id:"final-a4000",name:"Final A4000",brand:"Final",type:"IEM",driver:"Dynamic",price_usd:129,price_inr:10600,signature:"Bright",score:84,impedance_ohm:18,sensitivity_db:100},
  {id:"thieaudio-monarch-mk3",name:"ThieAudio Monarch Mk3",brand:"ThieAudio",type:"IEM",driver:"Hybrid",price_usd:999,price_inr:82000,signature:"Neutral",score:95,impedance_ohm:8,sensitivity_db:110},
  {id:"yanyin-canon-2",name:"Yanyin Canon II",brand:"Yanyin",type:"IEM",driver:"Hybrid",price_usd:339,price_inr:27900,signature:"V-Shaped",score:87,impedance_ohm:11,sensitivity_db:108},
  // Over-Ear
  {id:"sennheiser-hd-600",name:"Sennheiser HD 600",brand:"Sennheiser",type:"Over-Ear",driver:"Dynamic",price_usd:399,price_inr:32890,signature:"Neutral",score:93,impedance_ohm:300,sensitivity_db:97},
  {id:"sennheiser-hd-650",name:"Sennheiser HD 650",brand:"Sennheiser",type:"Over-Ear",driver:"Dynamic",price_usd:449,price_inr:37000,signature:"Neutral-Warm",score:94,impedance_ohm:300,sensitivity_db:103},
  {id:"sennheiser-hd-660s2",name:"Sennheiser HD 660S2",brand:"Sennheiser",type:"Over-Ear",driver:"Dynamic",price_usd:499,price_inr:41000,signature:"Neutral",score:92,impedance_ohm:300,sensitivity_db:104},
  {id:"sennheiser-hd-800s",name:"Sennheiser HD 800S",brand:"Sennheiser",type:"Over-Ear",driver:"Dynamic",price_usd:1599,price_inr:131000,signature:"Neutral",score:96,impedance_ohm:300,sensitivity_db:102},
  {id:"sennheiser-momentum-4",name:"Sennheiser Momentum 4",brand:"Sennheiser",type:"Over-Ear",driver:"Dynamic",price_usd:349,price_inr:28890,signature:"Neutral-Warm",score:89,impedance_ohm:48,sensitivity_db:106},
  {id:"beyerdynamic-dt-770-pro",name:"Beyerdynamic DT 770 Pro",brand:"Beyerdynamic",type:"Over-Ear",driver:"Dynamic",price_usd:169,price_inr:13900,signature:"V-Shaped",score:86,impedance_ohm:80,sensitivity_db:96},
  {id:"beyerdynamic-dt-990-pro",name:"Beyerdynamic DT 990 Pro",brand:"Beyerdynamic",type:"Over-Ear",driver:"Dynamic",price_usd:179,price_inr:14700,signature:"Bright",score:85,impedance_ohm:250,sensitivity_db:96},
  {id:"audio-technica-m50x",name:"Audio-Technica ATH-M50x",brand:"Audio-Technica",type:"Over-Ear",driver:"Dynamic",price_usd:149,price_inr:12290,signature:"V-Shaped",score:84,impedance_ohm:38,sensitivity_db:99},
  {id:"audio-technica-r70x",name:"Audio-Technica ATH-R70x",brand:"Audio-Technica",type:"Over-Ear",driver:"Dynamic",price_usd:349,price_inr:28700,signature:"Neutral",score:90,impedance_ohm:470,sensitivity_db:98},
  {id:"audio-technica-adx5000",name:"Audio-Technica ATH-ADX5000",brand:"Audio-Technica",type:"Over-Ear",driver:"Dynamic",price_usd:1999,price_inr:164000,signature:"Neutral",score:95,impedance_ohm:420,sensitivity_db:100},
  {id:"akg-k712-pro",name:"AKG K712 Pro",brand:"AKG",type:"Over-Ear",driver:"Dynamic",price_usd:299,price_inr:24600,signature:"Neutral-Warm",score:88,impedance_ohm:62,sensitivity_db:105},
  {id:"akg-k371",name:"AKG K371",brand:"AKG",type:"Over-Ear",driver:"Dynamic",price_usd:149,price_inr:12290,signature:"Neutral",score:85,impedance_ohm:32,sensitivity_db:114},
  {id:"akg-k240-studio",name:"AKG K240 Studio",brand:"AKG",type:"Over-Ear",driver:"Dynamic",price_usd:69,price_inr:5700,signature:"Neutral",score:78,impedance_ohm:55,sensitivity_db:104},
  {id:"hifiman-edition-xs",name:"HiFiMAN Edition XS",brand:"HiFiMAN",type:"Over-Ear",driver:"Planar",price_usd:499,price_inr:41000,signature:"Neutral",score:93,impedance_ohm:18,sensitivity_db:92},
  {id:"hifiman-ananda",name:"HiFiMAN Ananda",brand:"HiFiMAN",type:"Over-Ear",driver:"Planar",price_usd:399,price_inr:32890,signature:"Neutral",score:91,impedance_ohm:25,sensitivity_db:103},
  {id:"hifiman-he400se",name:"HiFiMAN HE400SE",brand:"HiFiMAN",type:"Over-Ear",driver:"Planar",price_usd:109,price_inr:8990,signature:"Neutral",score:84,impedance_ohm:25,sensitivity_db:91},
  {id:"hifiman-arya-stealth",name:"HiFiMAN Arya Stealth",brand:"HiFiMAN",type:"Over-Ear",driver:"Planar",price_usd:1299,price_inr:106900,signature:"Neutral",score:96,impedance_ohm:35,sensitivity_db:94},
  {id:"focal-clear-mg",name:"Focal Clear MG",brand:"Focal",type:"Over-Ear",driver:"Dynamic",price_usd:1490,price_inr:122600,signature:"Neutral",score:95,impedance_ohm:55,sensitivity_db:104},
  {id:"focal-celestee",name:"Focal Celestee",brand:"Focal",type:"Over-Ear",driver:"Dynamic",price_usd:990,price_inr:81500,signature:"Warm",score:90,impedance_ohm:35,sensitivity_db:105},
  {id:"focal-elegia",name:"Focal Elegia",brand:"Focal",type:"Over-Ear",driver:"Dynamic",price_usd:899,price_inr:74000,signature:"Neutral-Warm",score:89,impedance_ohm:35,sensitivity_db:105},
  {id:"dan-clark-aeon-2-noire",name:"Dan Clark Aeon 2 Noire",brand:"Dan Clark Audio",type:"Over-Ear",driver:"Planar",price_usd:899,price_inr:74000,signature:"Neutral-Warm",score:91,impedance_ohm:13,sensitivity_db:92},
  {id:"meze-109-pro",name:"Meze 109 Pro",brand:"Meze",type:"Over-Ear",driver:"Dynamic",price_usd:799,price_inr:65800,signature:"Warm",score:91,impedance_ohm:40,sensitivity_db:112},
  {id:"meze-99-classics",name:"Meze 99 Classics",brand:"Meze",type:"Over-Ear",driver:"Dynamic",price_usd:309,price_inr:25400,signature:"Warm",score:86,impedance_ohm:32,sensitivity_db:103},
  {id:"grado-sr325x",name:"Grado SR325x",brand:"Grado",type:"Over-Ear",driver:"Dynamic",price_usd:295,price_inr:24300,signature:"Bright",score:84,impedance_ohm:38,sensitivity_db:99},
  {id:"grado-sr80x",name:"Grado SR80x",brand:"Grado",type:"Over-Ear",driver:"Dynamic",price_usd:99,price_inr:8100,signature:"Bright",score:81,impedance_ohm:38,sensitivity_db:99},
  {id:"philips-shp9500",name:"Philips SHP9500",brand:"Philips",type:"Over-Ear",driver:"Dynamic",price_usd:79,price_inr:6500,signature:"Neutral",score:82,impedance_ohm:32,sensitivity_db:101},
  {id:"sony-wh-1000xm4",name:"Sony WH-1000XM4",brand:"Sony",type:"Over-Ear",driver:"Dynamic",price_usd:279,price_inr:23090,signature:"Warm",score:89,impedance_ohm:48,sensitivity_db:104},
  {id:"sony-mdr-7506",name:"Sony MDR-7506",brand:"Sony",type:"Over-Ear",driver:"Dynamic",price_usd:99,price_inr:8100,signature:"Neutral",score:83,impedance_ohm:63,sensitivity_db:106},
  {id:"sony-ult-wear",name:"Sony ULT Wear",brand:"Sony",type:"Over-Ear",driver:"Dynamic",price_usd:199,price_inr:16390,signature:"V-Shaped",score:80,impedance_ohm:32,sensitivity_db:110},
  {id:"bose-qc-ultra",name:"Bose QuietComfort Ultra",brand:"Bose",type:"Over-Ear",driver:"Dynamic",price_usd:429,price_inr:35490,signature:"Neutral-Warm",score:90,impedance_ohm:32,sensitivity_db:106},
  {id:"marshall-monitor-ii",name:"Marshall Monitor II ANC",brand:"Marshall",type:"Over-Ear",driver:"Dynamic",price_usd:349,price_inr:28790,signature:"V-Shaped",score:82,impedance_ohm:32,sensitivity_db:96},
  {id:"apple-airpods-max",name:"Apple AirPods Max",brand:"Apple",type:"Over-Ear",driver:"Dynamic",price_usd:549,price_inr:59900,signature:"Neutral-Warm",score:88,impedance_ohm:32,sensitivity_db:100},
  // TWS
  {id:"sony-wf-1000xm5",name:"Sony WF-1000XM5",brand:"Sony",type:"TWS",driver:"Dynamic",price_usd:299,price_inr:24990,signature:"Neutral-Warm",score:92,impedance_ohm:16,sensitivity_db:106},
  {id:"samsung-galaxy-buds3-pro",name:"Samsung Galaxy Buds3 Pro",brand:"Samsung",type:"TWS",driver:"Dynamic",price_usd:249,price_inr:17999,signature:"Neutral",score:88,impedance_ohm:16,sensitivity_db:106},
  {id:"samsung-galaxy-buds-fe",name:"Samsung Galaxy Buds FE",brand:"Samsung",type:"TWS",driver:"Dynamic",price_usd:99,price_inr:6999,signature:"Neutral-Warm",score:80,impedance_ohm:16,sensitivity_db:104},
  {id:"google-pixel-buds-pro-2",name:"Google Pixel Buds Pro 2",brand:"Google",type:"TWS",driver:"Dynamic",price_usd:229,price_inr:19999,signature:"Neutral",score:87,impedance_ohm:16,sensitivity_db:106},
  {id:"jabra-elite-10",name:"Jabra Elite 10",brand:"Jabra",type:"TWS",driver:"Dynamic",price_usd:249,price_inr:20590,signature:"Neutral-Warm",score:87,impedance_ohm:16,sensitivity_db:108},
  {id:"jabra-elite-85t",name:"Jabra Elite 85t",brand:"Jabra",type:"TWS",driver:"Dynamic",price_usd:179,price_inr:14790,signature:"Neutral",score:84,impedance_ohm:16,sensitivity_db:104},
  {id:"jbl-tour-pro-2",name:"JBL Tour Pro 2",brand:"JBL",type:"TWS",driver:"Dynamic",price_usd:249,price_inr:20590,signature:"V-Shaped",score:85,impedance_ohm:16,sensitivity_db:108},
  {id:"jbl-tune-230nc",name:"JBL Tune 230NC TWS",brand:"JBL",type:"TWS",driver:"Dynamic",price_usd:99,price_inr:5499,signature:"V-Shaped",score:76,impedance_ohm:16,sensitivity_db:104},
  {id:"sennheiser-mtw-4",name:"Sennheiser Momentum TW 4",brand:"Sennheiser",type:"TWS",driver:"Dynamic",price_usd:299,price_inr:24990,signature:"Neutral-Warm",score:91,impedance_ohm:16,sensitivity_db:107},
  {id:"bose-qc-earbuds-ii",name:"Bose QC Earbuds II",brand:"Bose",type:"TWS",driver:"Dynamic",price_usd:279,price_inr:23090,signature:"Neutral-Warm",score:89,impedance_ohm:16,sensitivity_db:106},
  {id:"bose-qc-ultra-earbuds",name:"Bose QC Ultra Earbuds",brand:"Bose",type:"TWS",driver:"Dynamic",price_usd:299,price_inr:24990,signature:"Neutral-Warm",score:90,impedance_ohm:16,sensitivity_db:107},
  {id:"nothing-ear-open",name:"Nothing Ear (open)",brand:"Nothing",type:"TWS",driver:"Dynamic",price_usd:149,price_inr:8499,signature:"Neutral",score:79,impedance_ohm:16,sensitivity_db:102},
  {id:"oneplus-buds-pro-3",name:"OnePlus Buds Pro 3",brand:"OnePlus",type:"TWS",driver:"Dynamic",price_usd:179,price_inr:11999,signature:"V-Shaped",score:84,impedance_ohm:16,sensitivity_db:106},
  {id:"oppo-enco-x2",name:"Oppo Enco X2",brand:"Oppo",type:"TWS",driver:"Hybrid",price_usd:199,price_inr:11990,signature:"Neutral",score:85,impedance_ohm:16,sensitivity_db:108},
  {id:"fiio-fw5",name:"FiiO FW5",brand:"FiiO",type:"TWS",driver:"Hybrid",price_usd:129,price_inr:10690,signature:"Neutral-Warm",score:83,impedance_ohm:32,sensitivity_db:106},
  {id:"soundpeats-opera-05",name:"SoundPeats Opera 05",brand:"SoundPeats",type:"TWS",driver:"Hybrid",price_usd:79,price_inr:4999,signature:"V-Shaped",score:78,impedance_ohm:16,sensitivity_db:104},
  {id:"moondrop-space-travel",name:"Moondrop Space Travel",brand:"Moondrop",type:"TWS",driver:"Dynamic",price_usd:25,price_inr:2100,signature:"Neutral",score:75,impedance_ohm:16,sensitivity_db:100},
  {id:"edifier-stax-spirit-s3",name:"Edifier STAX Spirit S3",brand:"Edifier",type:"Over-Ear",driver:"Planar",price_usd:399,price_inr:32890,signature:"Neutral",score:88,impedance_ohm:20,sensitivity_db:94},
  {id:"audeze-lcd-2-classic",name:"Audeze LCD-2 Classic",brand:"Audeze",type:"Over-Ear",driver:"Planar",price_usd:899,price_inr:74000,signature:"Warm",score:92,impedance_ohm:70,sensitivity_db:101},
  {id:"audeze-maxwell",name:"Audeze Maxwell",brand:"Audeze",type:"Over-Ear",driver:"Planar",price_usd:299,price_inr:24690,signature:"Warm",score:88,impedance_ohm:16,sensitivity_db:96},
  {id:"zmf-aeolus",name:"ZMF Aeolus",brand:"ZMF",type:"Over-Ear",driver:"Dynamic",price_usd:1199,price_inr:98700,signature:"Warm",score:94,impedance_ohm:300,sensitivity_db:101},
  {id:"fostex-th-900mk2",name:"Fostex TH-900mk2",brand:"Fostex",type:"Over-Ear",driver:"Dynamic",price_usd:1699,price_inr:139900,signature:"V-Shaped",score:93,impedance_ohm:25,sensitivity_db:100},
  {id:"sivga-sv023",name:"Sivga SV023",brand:"Sivga",type:"Over-Ear",driver:"Dynamic",price_usd:169,price_inr:13900,signature:"Warm",score:82,impedance_ohm:32,sensitivity_db:103},
  {id:"samson-sr850",name:"Samson SR850",brand:"Samson",type:"Over-Ear",driver:"Dynamic",price_usd:49,price_inr:4000,signature:"Bright",score:74,impedance_ohm:32,sensitivity_db:100},
  {id:"superlux-hd668b",name:"Superlux HD668B",brand:"Superlux",type:"Over-Ear",driver:"Dynamic",price_usd:38,price_inr:3100,signature:"Bright",score:73,impedance_ohm:56,sensitivity_db:98},
  {id:"jbl-live-770nc",name:"JBL Live 770NC",brand:"JBL",type:"Over-Ear",driver:"Dynamic",price_usd:199,price_inr:16400,signature:"V-Shaped",score:81,impedance_ohm:32,sensitivity_db:102},
  {id:"skullcandy-crusher-evo",name:"Skullcandy Crusher Evo",brand:"Skullcandy",type:"Over-Ear",driver:"Dynamic",price_usd:129,price_inr:10600,signature:"V-Shaped",score:76,impedance_ohm:32,sensitivity_db:100},
  {id:"anker-soundcore-q45",name:"Anker Soundcore Q45",brand:"Anker",type:"Over-Ear",driver:"Dynamic",price_usd:99,price_inr:8100,signature:"Neutral-Warm",score:79,impedance_ohm:32,sensitivity_db:104},
  {id:"apple-airpods-4-anc",name:"Apple AirPods 4 ANC",brand:"Apple",type:"TWS",driver:"Dynamic",price_usd:179,price_inr:14900,signature:"Neutral",score:85,impedance_ohm:32,sensitivity_db:105},
  {id:"beats-studio-pro",name:"Beats Studio Pro",brand:"Beats",type:"Over-Ear",driver:"Dynamic",price_usd:349,price_inr:38900,signature:"V-Shaped",score:83,impedance_ohm:48,sensitivity_db:107},
];

// Generate common fields for new headphones
const allHeadphones = [...existingHeadphones];
const existingIds = new Set(allHeadphones.map(h => h.id));

for (const h of newHeadphones) {
  if (existingIds.has(h.id)) continue;
  if (allHeadphones.length >= 100) break;

  const freqBase = h.signature === "Warm" ? [72,73,74,75,74,73,72,71,69,67,64,61,58,52,44] :
                   h.signature === "V-Shaped" ? [74,75,75,73,71,69,68,70,73,75,74,72,69,62,54] :
                   h.signature === "Bright" ? [62,65,68,71,73,74,75,76,77,76,74,72,70,66,60] :
                   h.signature === "Neutral-Warm" ? [70,72,73,74,74,74,74,73,72,71,70,68,66,62,56] :
                   [66,68,71,73,74,75,75,74,73,72,71,69,67,63,58]; // Neutral
  
  const freqs = [20,30,50,100,200,500,1000,2000,3000,4000,5000,8000,10000,15000,20000];
  const freq_response = freqs.map((f, i) => [f, freqBase[i] + Math.floor(Math.random() * 4) - 2]);

  const prosPool = {
    "Warm": ["Rich bass", "Smooth treble", "Non-fatiguing", "Great for vocals", "Musical sound"],
    "V-Shaped": ["Exciting sound", "Punchy bass", "Crisp treble", "Fun to listen to", "Good for pop/EDM"],
    "Bright": ["Excellent detail", "Airy sound", "Great resolution", "Wide soundstage", "Analytical"],
    "Neutral": ["Accurate sound", "Great for mixing", "Balanced response", "Natural timbre", "Versatile"],
    "Neutral-Warm": ["Natural sound", "Smooth", "Great timbre", "Non-fatiguing", "Versatile"],
  };
  const consPool = {
    "Warm": ["Lacks detail", "Rolled-off treble", "Not analytical", "Bass can bloat"],
    "V-Shaped": ["Recessed mids", "Not for critical listening", "Can be fatiguing", "Colored sound"],
    "Bright": ["Can be fatiguing", "Harsh for some", "Sibilant", "Bass light"],
    "Neutral": ["Can sound boring", "Needs good source", "Not exciting", "Clinical"],
    "Neutral-Warm": ["Slightly warm", "Not the most detailed", "Could have more bass"],
  };

  const pros = prosPool[h.signature].sort(() => Math.random() - 0.5).slice(0, 3);
  const cons = consPool[h.signature].sort(() => Math.random() - 0.5).slice(0, 2);

  const verdictMap = {
    IEM: `A ${h.score >= 90 ? 'flagship' : h.score >= 80 ? 'mid-tier' : 'budget'} IEM from ${h.brand} with ${h.signature.toLowerCase()} tuning and ${h.driver.toLowerCase()} driver technology.`,
    "Over-Ear": `${h.brand}'s ${h.score >= 90 ? 'reference-grade' : h.score >= 80 ? 'solid' : 'entry-level'} over-ear headphone offering ${h.signature.toLowerCase()} sound signature.`,
    TWS: `${h.brand}'s ${h.score >= 85 ? 'premium' : h.score >= 75 ? 'capable' : 'budget'} true wireless earbuds with ${h.signature.toLowerCase()} tuning.`,
  };

  allHeadphones.push({
    ...h,
    freq_response,
    youtube_review_url: `https://youtube.com/watch?v=${h.id}`,
    image: `/images/headphones/${h.id}.jpg`,
    verdict: verdictMap[h.type],
    pros,
    cons,
    resale_value_6m: Math.round(h.price_usd * 0.70),
    resale_value_1y: Math.round(h.price_usd * 0.55),
  });
}

// Add resale values to existing headphones
for (const h of allHeadphones) {
  if (!h.resale_value_6m) {
    h.resale_value_6m = Math.round(h.price_usd * 0.70);
    h.resale_value_1y = Math.round(h.price_usd * 0.55);
  }
}

const final = allHeadphones.slice(0, 100);
fs.writeFileSync('./data/headphones.json', JSON.stringify(final, null, 2));
console.log(`Generated ${final.length} headphones`);
