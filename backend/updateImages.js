import fs from 'fs';

const ids = [
    "1546069901-ba9599a7e63c", "1567620905033-521f83859af8", "1565299624946-b28f40a0ae38", "1512621776951-a57141f2e9ef",
    "1504674900247-0877df9cc836", "1476224483481-17c4520b24af", "1493770348161-369560ae357d", "1482049016688-2d3e1b311543",
    "1484723091739-30a097e8f929", "1499028344343-cd173ffc68a9", "1467003909585-2f8a72700288", "1511690656952-34342bb7c2f2",
    "1506084868230-bb9d95c24759", "1490645935967-10de6ba17051", "1432139555190-58524dae6a55", "1473093226795-af9932fe5856",
    "1540189549336-e6e99c3679fe", "1543353071-873f17a7a088", "1563379091339-03b1cbb8e4c8", "1603360946369-dc9bb6258143",
    "1525351484163-7529414344d8", "1572490122747-3968b75cc699", "1514326640560-7d063ef2aed5", "1633945274405-b6c8069047b0",
    "1598515214211-89d3c73ae83b", "1610057099443-fde8c4d50f91", "1497926015418-f2430e386356", "1498307833015-e2743ae9af8c",
    "1501443762994-82bd5dace89a", "1508736767468-d7df7d370b7f", "1515002219570-a226ed2f59d5", "1517433367417-649d28a30140",
    "1519708227418-c8fd9a32b7a2", "1520011566485-f00e7040e393", "1532980469588-d824d2837bc8", "1533612239633-d71e41c46917",
    "1550543760-246218108c31", "1551219117-ee5237f07802", "1560611580-4a246b7a070f", "1585032248861-492344792f9b",
    "1512621776951-a57141f2e9ef", "1493770348161-369560ae357d", "1455619452473-bcdd91e204b1", "1464454709133-2a67749bc733",
    "1470390363883-b1d58e3ca8c8", "1470549638665-2f1a0a501569", "1472110273595-8ba99059cd73", "1475091014391-58eedbb51612",
    "1478144546084-3f1a20e60d36", "1481068132511-2199c383e95b", "1484980859173-971c2600237c", "1485923741551-5511095fe3a4",
    "1496412705825-473c567812ee", "1504754524776-8f4f37799ca7", "1513104894114-e75ecf89c6d7", "1514326640560-7d063ef2aed5",
    "1532980469588-d824d2837bc8", "1551024709-37d3cb73843c", "1558961776-bc399201979b", "1565553648590-00539f400712",
    "1569718212-14072ba003be", "1571091723282-bb3a7605d4de", "1574484284136-1e7e59697d0b", "1586190848861-99246954a15a",
    "1589302168007-88ad629370ad", "1594212699767-331427a18d9c", "1604382353581-c0768148617b", "1615937651118-243f3f47738e",
    "1621995074057-bd632a4e1495", "1625220194127-d0d1cb37f480", "1626074353773-ee648e029193", "1627303102374-9d42fa35777f",
    "1633945274405-b6c8069047b0", "1634629486676-e82f3473188e"
];

const assetsPath = '../frontend/src/assets/frontend_assets/assets.js';
let content = fs.readFileSync(assetsPath, 'utf8');

let imgIndex = 0;

// Update food_list images
content = content.replace(/image: "https:\/\/images\.unsplash\.com\/photo-[^"]+"/g, (match) => {
    const id = ids[imgIndex % ids.length];
    imgIndex++;
    return `image: "https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=80"`;
});

// Update menu_list images too
content = content.replace(/menu_image: "https:\/\/images\.unsplash\.com\/photo-[^"]+"/g, (match) => {
    const id = ids[imgIndex % ids.length];
    imgIndex++;
    return `menu_image: "https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=80"`;
});

fs.writeFileSync(assetsPath, content);
console.log(`Updated assets.js with ${imgIndex} unique IDs.`);

// Now update seedClean.js
const seedPath = './seedClean.js';
if (fs.existsSync(seedPath)) {
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    let seedImgIndex = 0;
    seedContent = seedContent.replace(/image: "https:\/\/images\.unsplash\.com\/photo-[^"]+"/g, (match) => {
        const id = ids[seedImgIndex % ids.length];
        seedImgIndex++;
        return `image: "https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=80"`;
    });
    fs.writeFileSync(seedPath, seedContent);
    console.log(`Updated seedClean.js with ${seedImgIndex} unique IDs.`);
}
