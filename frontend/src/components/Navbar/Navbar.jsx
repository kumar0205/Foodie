import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { ThemeContext } from "../context/ThemeContext";
import { assets } from "../../assets/frontend_assets/assets";
import {
  Home,
  Menu as MenuIcon,
  Smartphone,
  Heart,
  Phone,
  ShoppingCart,
  User,
  Sun,
  Moon,
  HelpCircle,
  Utensils,
  Users,
  Info,
  CircleDollarSign,
  ShoppingBag,
  ArrowLeft,
  LogOut,
  X,
  Search,
} from "lucide-react";

const Navbar = ({ setShowLogin }) => {
  const { cartItems, wishlistItems, getTotalCartItems } = useContext(StoreContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // scrolling down
        setIsVisible(false);
      } else { // scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleNavMenuClick = (menuName, id) => {
    setMenu(menuName);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  // to trigger the dark theme on scroll bar
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const navMenu = (
    <>
      <Link
        to="/"
        onClick={() => {
          setMenu("home");
          if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className={`nav-item ${menu === "home" ? "active" : ""}`}
      >
        <Home size={18} />
        <span>Home</span>
      </Link>
      <Link
        to="/book-table"
        onClick={() => setMenu("book-table")}
        className={`nav-item ${menu === "book-table" ? "active" : ""}`}
      >
        <Users size={18} />
        <span>Book Table</span>
      </Link>
      <Link
        to="/myorders"
        onClick={() => setMenu("my-orders")}
        className={`nav-item ${menu === "my-orders" ? "active" : ""}`}
      >
        <ShoppingBag size={18} />
        <span>My Orders</span>
      </Link>
      <Link
        to="/"
        onClick={() => {
          setMenu("search");
          const section = document.querySelector('.hero-container');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              const searchInput = document.querySelector('.search-input');
              if (searchInput) searchInput.focus();
            }, 600);
          }
        }}
        className={`nav-item ${menu === "search" ? "active" : ""}`}
      >
        <Search size={18} />
        <span>Search</span>
      </Link>
      <Link
        to="/mybookings"
        onClick={() => setMenu("my-bookings")}
        className={`nav-item ${menu === "my-bookings" ? "active" : ""}`}
      >
        <Smartphone size={18} />
        <span>My Bookings</span>
      </Link>
    </>
  );

  const totalCartItems = getTotalCartItems();

  const wishlistCount = Object.keys(wishlistItems || {}).length;

  return (
    <>
      {/* Top Navigation Bar */}
      <div className={`navbar ${theme === "dark" ? "navbar-dark" : ""} ${!isVisible ? "navbar-hidden" : ""}`}>
        <div className="navbar-left">
          <Link to="/" onClick={() => setMenu("home")}>
            <img src={assets.logo} alt="Foodie Logo" className="app-icon" />
          </Link>
        </div>

        <nav className="navbar-menu navbar-menu-desktop">{navMenu}</nav>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link to="/wishlist" className="icon-button wishlist-icon" aria-label="Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 && <div className="cart-badge">{wishlistCount}</div>}
          </Link>


          {user ? (
            <button className="menu-trigger-btn" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={20} />
            </button>
          ) : (
            <button className="signin-button" onClick={() => setShowLogin(true)}>
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Side Menu Panel */}
      <div className={`side-panel-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}>
        <div className="side-panel" onClick={(e) => e.stopPropagation()}>
          <div className="side-panel-header">
            <div className="user-profile-info">
              <div className="user-avatar-large">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-text-info">
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            <button className="close-panel-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="side-panel-content">
            <Link to="/aboutus" className="side-link" onClick={() => setIsSidebarOpen(false)}>
              <Info size={18} /> About Us
            </Link>
            <Link to="/contact" className="side-link" onClick={() => setIsSidebarOpen(false)}>
              <Phone size={18} /> Contact Us
            </Link>
            <div className="side-divider"></div>
            <button className="side-logout-btn" onClick={() => { handleLogout(); setIsSidebarOpen(false); }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="navbar-menu-mobile">{navMenu}</nav>
    </>
  );
};

export default Navbar;
