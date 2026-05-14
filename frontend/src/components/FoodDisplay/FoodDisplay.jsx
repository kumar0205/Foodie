import React, { useContext, useState, useEffect } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, searchQuery = "" }) => {
  const { food_list, fetchFoodList } = useContext(StoreContext);

  useEffect(() => {
    fetchFoodList();
  }, []);

  const [filterType, setFilterType] = useState('all'); // all | veg | non-veg
  const [sortOrder, setSortOrder] = useState('default'); // default | low-to-high | high-to-low

  const handleToggle = (type) => {
    setFilterType(type);
  };

  const filteredFoodList = food_list.filter((item) => {
    // 🛑 Handle availability (default to true if undefined)
    if (item.available === false) return false;

    // Normalize category names for comparison
    const itemCat = (item.category || "").trim().toLowerCase();
    const activeCat = (category || "All").trim().toLowerCase();

    // Flexible matching: check if activeCat is in itemCat or vice versa
    const matchCategory = 
      activeCat === 'all' || 
      activeCat === itemCat || 
      itemCat.includes(activeCat) || 
      activeCat.includes(itemCat);
    
    const matchType =
      filterType === 'all' ||
      (filterType === 'veg' && (item.type || "").toLowerCase() === 'veg') ||
      (filterType === 'non-veg' && (item.type || "").toLowerCase() === 'nonveg');
    
    const matchSearch = 
      searchQuery === "" || 
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchType && matchSearch;
  });

  const sortedFoodList = [...filteredFoodList].sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.price - b.price;
    } else if (sortOrder === 'high-to-low') {
      return b.price - a.price;
    }
    return 0; // default order
  });

  // Debugging log to see why items might not be showing
  useEffect(() => {
    console.log(`Filtering by category: ${category}, Search: ${searchQuery}, Items found: ${filteredFoodList.length}`);
  }, [category, searchQuery, filteredFoodList.length]);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top Dishes Near You</h2>
      
      {/* Toggle Buttons & Sort Dropdown */}
      <div className="filter-sort-container">
        <div className="filter-toggle">
          <button
            className={filterType === 'all' ? 'active' : ''}
            onClick={() => handleToggle('all')}
          >
            All
          </button>
          <button
            className={filterType === 'veg' ? 'active' : ''}
            onClick={() => handleToggle('veg')}
          >
            Veg
          </button>
          <button
            className={filterType === 'non-veg' ? 'active' : ''}
            onClick={() => handleToggle('non-veg')}
          >
            Non-Veg
          </button>
        </div>
        
        <div className="sort-dropdown">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Sort by Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className='food-display-list'>
        {sortedFoodList.length > 0 ? (
          sortedFoodList.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <div className="no-items-found">
            <p>No items found for "{category === 'All' ? 'this search' : category}".</p>
            <p className="debug-hint">Check your database or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay