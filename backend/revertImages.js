import fs from 'fs';

const categoryImages = {
    "Fish": "1519708227418",
    "Prawns": "1559737558-2f5a35f4523b",
    "Kamju": "1587593810167-a84920ea0781",
    "Indian Bread": "1585937421612-70a008356fbe",
    "Rice": "1603133872878-684f208fb84b",
    "Ice Cream": "1501443762994-82bd5dace89a",
    "Milk Shakes": "1572490122747-3968b75cc699",
    "Family Packs": "1514326640560-7d063ef2aed5",
    "Veg Biryani": "1589302168068-964664d93dc0",
    "Biryani": "1633945274405-b6c8069047b0",
    "Chicken Dry": "1598515214211-89d3c73ae83b",
    "Tandoori": "1610057099443-fde8c4d50f91",
    "Veg Dry": "1546069901-ba9599a7e63c",
    "Tandoori Veg": "1546069901-ba9599a7e63c",
    "Mutton": "1603360946369-dc9bb6258143",
    "Egg": "1525351484163-7529414344d8"
};

const assetsPath = '../frontend/src/assets/frontend_assets/assets.js';
const seedPath = './seedClean.js';

function updateFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Split into lines to process each item
    const lines = content.split('\n');
    let currentCategory = '';
    
    const newLines = lines.map(line => {
        // Find category
        const catMatch = line.match(/category: "([^"]+)"/);
        if (catMatch) {
            currentCategory = catMatch[1];
        }
        
        // Find image and replace based on current category
        if (line.includes('image:') && currentCategory && categoryImages[currentCategory]) {
            const id = categoryImages[currentCategory];
            return line.replace(/image: "[^"]+"/, `image: "https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=80"`);
        }

        // Also update menu_image in menu_list
        const menuCatMatch = line.match(/menu_name: "([^"]+)"/);
        if (menuCatMatch) {
            currentCategory = menuCatMatch[1];
        }
        if (line.includes('menu_image:') && currentCategory && categoryImages[currentCategory]) {
             const id = categoryImages[currentCategory];
             return line.replace(/menu_image: "[^"]+"/, `menu_image: "https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=80"`);
        }
        
        return line;
    });

    fs.writeFileSync(path, newLines.join('\n'));
}

updateFile(assetsPath);
console.log('Updated assets.js with one image per category.');
updateFile(seedPath);
console.log('Updated seedClean.js with one image per category.');
