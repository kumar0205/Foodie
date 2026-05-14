import "dotenv/config";
import foodModel from "./models/foodModel.js";

const restaurantId = "67da10363734e701734b5899"; // Default restaurant ID from existing seeds

const newFoods = [
  // Fish
  { name: "Pepper Fish", price: 280, category: "Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", description: "Spicy and succulent fish tossed with black pepper and herbs.", type: "nonveg" },
  { name: "Apollo Fish", price: 280, category: "Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", description: "Classic Hyderabadi style deep-fried fish with tangy spices.", type: "nonveg" },
  { name: "Fish 65", price: 280, category: "Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", description: "Crispy fried fish chunks marinated in signature 65 spices.", type: "nonveg" },
  { name: "Fish Chilli", price: 280, category: "Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", description: "Indo-Chinese style fish sauteed with green chillies and bell peppers.", type: "nonveg" },
  { name: "Fish Manchuria", price: 280, category: "Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", description: "Fish dumplings in a thick, savory Manchurian gravy.", type: "nonveg" },
  { name: "Fish Curry", price: 280, category: "Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", description: "Traditional fish curry cooked with coconut milk and tamarind.", type: "nonveg" },
  
  // Prawns
  { name: "Pepper Prawns", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Fresh prawns stir-fried with crushed black pepper and curry leaves.", type: "nonveg" },
  { name: "Loose Prawns", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Crispy, batter-fried prawns served with a spicy dip.", type: "nonveg" },
  { name: "Prawns Chilli", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Spicy prawns tossed with onions, capsicum, and green chillies.", type: "nonveg" },
  { name: "Prawns 65", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Zesty and crispy prawns marinated in South Indian spices.", type: "nonveg" },
  { name: "Prawns Curry", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Succulent prawns cooked in a rich, spicy tomato-based gravy.", type: "nonveg" },
  { name: "Kadai Prawns Curry", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Prawns cooked with bell peppers and freshly ground kadai masala.", type: "nonveg" },
  { name: "Butter Prawns Curry", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Creamy and mild prawns curry enriched with butter and cream.", type: "nonveg" },
  { name: "Prawns Rayalaseema", price: 300, category: "Prawns", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80", description: "Extra spicy prawns curry from the Rayalaseema region.", type: "nonveg" },

  // Kamju
  { name: "Kamju Roast", price: 300, category: "Kamju", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", description: "Slow-roasted quail with traditional Indian spices.", type: "nonveg" },
  { name: "Kamju Pepper Roast", price: 300, category: "Kamju", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", description: "Quail roasted with a heavy hand of black pepper and aromatics.", type: "nonveg" },
  { name: "Kamju Ghee Roast", price: 300, category: "Kamju", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", description: "Rich quail roast cooked in pure desi ghee.", type: "nonveg" },
  { name: "Kamju Fry", price: 300, category: "Kamju", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", description: "Deep-fried quail pieces with a crispy spice coating.", type: "nonveg" },
  { name: "Kamju Curry", price: 300, category: "Kamju", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", description: "Spicy quail curry cooked in a thick masala base.", type: "nonveg" },
  { name: "Kamju Rayalaseema", price: 300, category: "Kamju", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", description: "Fiery quail preparation with Rayalaseema spice blend.", type: "nonveg" },

  // Indian Bread
  { name: "Roti", price: 30, category: "Indian Bread", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", description: "Whole wheat flatbread cooked in a clay oven.", type: "veg" },
  { name: "Butter Roti", price: 35, category: "Indian Bread", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", description: "Soft tandoori roti brushed with fresh butter.", type: "veg" },
  { name: "Butter Naan", price: 45, category: "Indian Bread", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", description: "Leavened refined flour bread with a buttery finish.", type: "veg" },
  { name: "Plain Naan", price: 40, category: "Indian Bread", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", description: "Classic soft and fluffy leavened bread.", type: "veg" },
  { name: "Garlic Naan", price: 50, category: "Indian Bread", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", description: "Naan infused with minced garlic and cilantro.", type: "veg" },
  { name: "Butter Kulcha", price: 40, category: "Indian Bread", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", description: "Soft and spongy bread stuffed or topped with butter.", type: "veg" },

  // Rice
  { name: "Veg Fried Rice", price: 180, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with fresh vegetables and soy sauce.", type: "veg" },
  { name: "Veg Schezwan Fried Rice", price: 200, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Spicy fried rice tossed in fiery Schezwan sauce.", type: "veg" },
  { name: "Gobi Fried Rice", price: 200, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with crispy cauliflower florets.", type: "veg" },
  { name: "Gobi Schezwan Fried Rice", price: 220, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Crispy Gobi and rice tossed in spicy Schezwan sauce.", type: "veg" },
  { name: "Kaju Fried Rice", price: 220, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Premium fried rice loaded with roasted cashews.", type: "veg" },
  { name: "Mushroom Fried Rice", price: 220, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with fresh mushrooms and seasonings.", type: "veg" },
  { name: "Paneer Fried Rice", price: 220, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with soft paneer cubes.", type: "veg" },
  { name: "Jeera Rice", price: 200, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Basmati rice tempered with cumin seeds and ghee.", type: "veg" },
  { name: "Egg Fried Rice", price: 200, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with scrambled eggs and veggies.", type: "nonveg" },
  { name: "Egg Schezwan Fried Rice", price: 220, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Spicy fried rice with scrambled eggs and Schezwan sauce.", type: "nonveg" },
  { name: "Chicken Fried Rice", price: 220, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with tender chicken chunks.", type: "nonveg" },
  { name: "Chicken Schezwan Fried Rice", price: 240, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Fiery fried rice with chicken and Schezwan spices.", type: "nonveg" },
  { name: "Prawns Fried Rice", price: 260, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Rice stir-fried with juicy prawns.", type: "nonveg" },
  { name: "Plain Rice", price: 60, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Steamed white basmati rice.", type: "veg" },
  { name: "Curd Rice", price: 90, category: "Rice", image: "https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&w=800&q=80", description: "Cooling rice mixed with yogurt and tempered with mustard seeds.", type: "veg" },

  // Ice Cream
  { name: "Vanila Ice Cream", price: 80, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Classic creamy vanilla flavored ice cream.", type: "veg" },
  { name: "Strawberry Ice Cream", price: 80, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Fresh strawberry flavored creamy ice cream.", type: "veg" },
  { name: "Butterscotch Ice Cream", price: 100, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Crunchy butterscotch bits in rich cream.", type: "veg" },
  { name: "Green Pista Ice Cream", price: 100, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Traditional pistachio flavored green ice cream.", type: "veg" },
  { name: "Chocolate Ice Cream", price: 100, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Rich and dark chocolate ice cream.", type: "veg" },
  { name: "Fresh Mango Ice Cream", price: 100, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Seasonal fresh mango pulp ice cream.", type: "veg" },
  { name: "Caramel Nuts Ice Cream", price: 120, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Sweet caramel swirls with crunchy roasted nuts.", type: "veg" },
  { name: "Dry Fruit Dream Ice Cream", price: 120, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "A blend of premium dry fruits in a creamy base.", type: "veg" },
  { name: "Black Current Ice Cream", price: 120, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80", description: "Tangy black currant berries in creamy ice cream.", type: "veg" },

  // Milk Shakes
  { name: "Vanilla Milkshake", price: 100, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Classic smooth vanilla milkshake.", type: "veg" },
  { name: "Strawberry Milkshake", price: 100, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Fresh strawberry blended with milk and ice cream.", type: "veg" },
  { name: "Butterscotch Milkshake", price: 100, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Rich butterscotch shake with crunchy bits.", type: "veg" },
  { name: "Chocolate Milkshake", price: 100, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Creamy chocolate shake for chocolate lovers.", type: "veg" },
  { name: "Chocolate Oreo Shake", price: 120, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Milkshake blended with Oreo cookies and chocolate.", type: "veg" },
  { name: "Fruit Salad Shake", price: 120, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Healthy shake with a mix of fresh seasonal fruits.", type: "veg" },
  { name: "Mango Badam Shake", price: 120, category: "Milk Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", description: "Creamy mango shake with roasted almond bits.", type: "veg" },

  // Family Packs
  { name: "Chicken Dum Biryani Family Pack", price: 850, category: "Family Packs", image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80", description: "Classic Chicken Dum Biryani served for 4 people.", type: "nonveg" },
  { name: "Chicken Fry Biryani Family Pack", price: 850, category: "Family Packs", image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80", description: "Spicy Chicken Fry Biryani served for 4 people.", type: "nonveg" },
  { name: "Chicken Spl. Biryani Family Pack", price: 850, category: "Family Packs", image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80", description: "Special Boneless Chicken Biryani served for 4 people.", type: "nonveg" },
  { name: "Mutton Biryani Family Pack", price: 950, category: "Family Packs", image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80", description: "Premium Mutton Biryani served for 4 people.", type: "nonveg" },
  { name: "Veg Family Pack", price: 750, category: "Family Packs", image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80", description: "Vegetarian Biryani or Pulav pack for 4 people.", type: "veg" },

  // Veg Biryani
  { name: "Veg Biryani", price: 220, category: "Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b1cbb8e4c8?auto=format&fit=crop&w=800&q=80", description: "Fragrant basmati rice cooked with mixed vegetables.", type: "veg" },
  { name: "Mushroom Biryani", price: 220, category: "Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b1cbb8e4c8?auto=format&fit=crop&w=800&q=80", description: "Biryani rice cooked with marinated fresh mushrooms.", type: "veg" },
  { name: "Paneer Biryani", price: 220, category: "Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b1cbb8e4c8?auto=format&fit=crop&w=800&q=80", description: "Biryani rice with soft and spiced paneer cubes.", type: "veg" },
  { name: "Kaju Palav", price: 220, category: "Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b1cbb8e4c8?auto=format&fit=crop&w=800&q=80", description: "Mildly spiced palav loaded with fried cashews.", type: "veg" },
  { name: "Ghee Rice", price: 160, category: "Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b1cbb8e4c8?auto=format&fit=crop&w=800&q=80", description: "Rice cooked with aromatic ghee and whole spices.", type: "veg" },

  // Biryani
  { name: "Chicken Dum Biryani", price: 250, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Authentic Hyderabadi Chicken Dum Biryani.", type: "nonveg" },
  { name: "Chicken Fry Biryani", price: 250, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Biryani rice topped with spicy fried chicken.", type: "nonveg" },
  { name: "Chicken Special Biryani", price: 290, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Special boneless chicken biryani with extra spices.", type: "nonveg" },
  { name: "Chicken Lollipop Biryani", price: 290, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Biryani rice served with crispy chicken lollipops.", type: "nonveg" },
  { name: "Mutton Fry Biryani", price: 370, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Spicy mutton fry served with aromatic biryani rice.", type: "nonveg" },
  { name: "Kamju Fry Biryani", price: 320, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Quail fry served with flavorful biryani rice.", type: "nonveg" },
  { name: "Fish Biryani", price: 280, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Marinated fish chunks layered with biryani rice.", type: "nonveg" },
  { name: "Prawns Biryani", price: 320, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Juicy prawns cooked with aromatic biryani spices.", type: "nonveg" },
  { name: "Egg Biryani", price: 200, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Boiled eggs served with spiced biryani rice.", type: "nonveg" },
  { name: "Biryani Rice", price: 150, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", description: "Flavorful biryani rice served without meat.", type: "veg" },

  // Chicken Dry
  { name: "Chicken Lollipop", price: 290, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Crispy and juicy chicken drummettes fried to perfection.", type: "nonveg" },
  { name: "Chicken Drum Stick", price: 290, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Succulent chicken drumsticks with a spicy marinade.", type: "nonveg" },
  { name: "Chicken Wings", price: 290, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Crispy chicken wings tossed in choice of sauce.", type: "nonveg" },
  { name: "Chicken Roast", price: 290, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Spicy roasted chicken with onions and chillies.", type: "nonveg" },
  { name: "Chicken 555", price: 230, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Creamy and spicy chicken appetizer with cashews.", type: "nonveg" },
  { name: "Dragon Chicken", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Fiery Indo-Chinese chicken strips with bell peppers.", type: "nonveg" },
  { name: "Chicken 65", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "The ultimate South Indian spicy fried chicken.", type: "nonveg" },
  { name: "Chicken Chilli", price: 250, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Classic chilli chicken with soy and green chillies.", type: "nonveg" },
  { name: "Chicken Manchuria", price: 250, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Chicken dumplings in a savory Manchurian sauce.", type: "nonveg" },
  { name: "Pepper Chicken", price: 250, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Chicken stir-fried with plenty of black pepper.", type: "nonveg" },
  { name: "Kajunut Chicken Dry", price: 250, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Chicken dry roast with crunchy cashews.", type: "nonveg" },
  { name: "Ginger Chicken", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Aromatic chicken prepared with fresh ginger.", type: "nonveg" },
  { name: "Lemon Chicken", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Zesty and tangy chicken with a hint of lemon.", type: "nonveg" },
  { name: "Honey Chicken", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Sweet and spicy honey glazed chicken.", type: "nonveg" },
  { name: "Pudina Chicken", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Refreshing mint-flavored roasted chicken.", type: "nonveg" },
  { name: "Garlic Chicken", price: 270, category: "Chicken Dry", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80", description: "Chicken tossed with roasted garlic and herbs.", type: "nonveg" },

  // Tandoori
  { name: "Tangadi Kabab", price: 330, category: "Tandoori", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", description: "Chicken drumsticks marinated in yogurt and spices, grilled.", type: "nonveg" },
  { name: "Hariyali Kabab", price: 330, category: "Tandoori", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", description: "Green herb marinated chicken chunks grilled to perfection.", type: "nonveg" },
  { name: "Chicken Tikka", price: 330, category: "Tandoori", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", description: "Classic spiced and grilled chicken chunks.", type: "nonveg" },
  { name: "Acahari Chicken Tikka", price: 330, category: "Tandoori", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", description: "Chicken tikka with a tangy pickling spice marinade.", type: "nonveg" },
  { name: "Malai Murg Kabab", price: 360, category: "Tandoori", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", description: "Creamy and mild chicken kababs with cheese and cream.", type: "nonveg" },

  // Veg Dry
  { name: "Kaju Dry", price: 220, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Fried cashews with salt and mild spices.", type: "veg" },
  { name: "Gobi 65", price: 180, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Crispy fried cauliflower with 65 spices.", type: "veg" },
  { name: "Gobi Chilli", price: 180, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Spicy cauliflower tossed with chillies and soy sauce.", type: "veg" },
  { name: "Gobi Manchuria", price: 180, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "All-time favorite Gobi Manchurian.", type: "veg" },
  { name: "Gobi Pepper Dry", price: 180, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Crispy Gobi stir-fried with black pepper.", type: "veg" },
  { name: "Gobi Salt & Pepper Dry", price: 260, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Crispy fried cauliflower with simple salt and pepper seasoning.", type: "veg" },
  { name: "Paneer Sticks", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Fried paneer strips with a crunchy coating.", type: "veg" },
  { name: "Paneer Manchuria", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Soft paneer cubes in Manchurian sauce.", type: "veg" },
  { name: "Paneer 65", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Spicy and crispy paneer cubes.", type: "veg" },
  { name: "Paneer Chilli", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Indo-Chinese style chilli paneer.", type: "veg" },
  { name: "Pepper Paneer", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Paneer cubes tossed with crushed pepper.", type: "veg" },
  { name: "Butter Garlic Paneer", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Paneer cooked with lots of garlic and butter.", type: "veg" },
  { name: "Mushroom Bell Pepper", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Fresh mushrooms and bell peppers stir-fry.", type: "veg" },
  { name: "Mushroom Chilli", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Spicy chilli mushroom.", type: "veg" },
  { name: "Mushroom 65", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Crispy fried mushrooms with 65 spices.", type: "veg" },
  { name: "Mushroom Manchuria", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Mushroom in savory Manchurian sauce.", type: "veg" },
  { name: "Mushroom Salt & Pepper", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Crispy mushrooms with salt and pepper.", type: "veg" },
  { name: "Baby Corn Salt & Pepper", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Crispy baby corn with salt and pepper.", type: "veg" },
  { name: "Baby Corn 65", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Spicy fried baby corn.", type: "veg" },
  { name: "Baby Corn Chilli", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Indo-Chinese chilli baby corn.", type: "veg" },
  { name: "Baby Corn Manchuria", price: 240, category: "Veg Dry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Baby corn in Manchurian sauce.", type: "veg" },

  // Tandoori Veg
  { name: "Mushroom Tikka", price: 300, category: "Tandoori Veg", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Spiced and grilled fresh mushrooms.", type: "veg" },
  { name: "Paneer Tikka", price: 320, category: "Tandoori Veg", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Classic tandoori grilled paneer chunks.", type: "veg" },
  { name: "Paneer Achari Tikka", price: 320, category: "Tandoori Veg", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Paneer tikka with pickling spices.", type: "veg" },
  { name: "Zaffrani Paneer Tikka", price: 320, category: "Tandoori Veg", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Saffron flavored rich paneer tikka.", type: "veg" },
  { name: "Hariyali Paneer Tikka", price: 320, category: "Tandoori Veg", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Green herb marinated grilled paneer.", type: "veg" },

  // Mutton
  { name: "Mutton Roast", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Spicy and tender mutton dry roast.", type: "nonveg" },
  { name: "Mutton Ghee Roast", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Rich mutton roast cooked in pure ghee.", type: "nonveg" },
  { name: "Mutton Pepper Roast", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Mutton roast with a kick of black pepper.", type: "nonveg" },
  { name: "Mutton Fry", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Deep-fried spiced mutton pieces.", type: "nonveg" },
  { name: "Mutton Curry", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Hearty mutton curry with traditional spices.", type: "nonveg" },
  { name: "Mutton Rayalaseema", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Fiery mutton curry from the Rayalaseema region.", type: "nonveg" },
  { name: "Mutton Malai Curry", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Creamy and mild mutton preparation.", type: "nonveg" },
  { name: "Mutton Hyderabadi", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Rich mutton curry with Hyderabadi flavors.", type: "nonveg" },
  { name: "Kadai Mutton", price: 370, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Mutton cooked with bell peppers and kadai masala.", type: "nonveg" },
  { name: "Mutton Paya", price: 300, category: "Mutton", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", description: "Traditional slow-cooked mutton trotters soup.", type: "nonveg" },

  // Egg
  { name: "Boiled Egg", price: 30, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Two perfectly boiled eggs.", type: "nonveg" },
  { name: "Egg Burge", price: 120, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Spicy scrambled eggs with onions and tomatoes.", type: "nonveg" },
  { name: "Egg Roast", price: 120, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Boiled eggs roasted with spicy onion masala.", type: "nonveg" },
  { name: "Egg Chilli", price: 160, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Fried eggs tossed in spicy chilli sauce.", type: "nonveg" },
  { name: "Egg 65", price: 160, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Crispy fried egg chunks with 65 spices.", type: "nonveg" },
  { name: "Egg Manchuria", price: 160, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Fried egg balls in savory Manchurian sauce.", type: "nonveg" },
  { name: "Egg Kheema Masala", price: 180, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Grated eggs cooked with spicy minced masala.", type: "nonveg" },
  { name: "Egg Rayalseema", price: 180, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Fiery egg curry from Rayalaseema.", type: "nonveg" },
  { name: "Egg Curry", price: 180, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Classic egg curry in a tomato-onion base.", type: "nonveg" },
  { name: "Egg Palak", price: 180, category: "Egg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", description: "Boiled eggs cooked in a smooth spinach gravy.", type: "nonveg" }
];

const seedNew = async () => {
    try {
        console.log("Starting Firestore seed for new requested items...");

        const fullFoodData = newFoods.map(item => ({
            ...item,
            restaurantId: restaurantId,
            available: true
        }));

        console.log(`Adding ${fullFoodData.length} new items...`);
        
        for (const item of fullFoodData) {
            await foodModel.create(item);
            console.log(`Added: ${item.name}`);
        }

        console.log(`✅ Successfully added ${fullFoodData.length} items to Firestore!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedNew();
