import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../components/context/StoreContext";

const Home = () => {
  const { food_list } = useContext(StoreContext);
  const location = useLocation();
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [showButton, setShowButton] = useState(false);

  const suggestions = food_list.map(item => item.name);
 
  useEffect(() => {
      if (location.state?.scrollTo){
        const section = document.getElementById(location.state?.scrollTo);
        if(section){
          setTimeout(()=> {
            section.scrollIntoView({behavior: "smooth"});
          }, 200);
        }
      }
    }, [location.state]);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const shouldScroll = localStorage.getItem("scrollToMenu");
    if (shouldScroll === "true") {
      const section = document.getElementById("explore-menu");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      localStorage.removeItem("scrollToMenu");
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCategory('All'); // Reset category to 'All' for global search
    const section = document.getElementById("food-display");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} suggestions={suggestions} />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
