import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FavouritesContext } from "../context/FavouritesContext";
import { OrdersContext } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { favourites } = useContext(FavouritesContext);
  const { orders } = useContext(OrdersContext);
  const { token, username, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const favouriteLength = favourites.length;

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    closeMenu();
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className={`site-header${menuOpen ? " menu-open" : ""}`}>
      <div className="header-inner">
        <Link to={token ? "/home" : "/"} className="logo" onClick={closeMenu}>
          <span className="logo-text">🏝️ Travel Planner</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      <nav className="nav">
          {token ? (
            <>
              {username && <span className="nav-user">Hi, {username}</span>}
              <NavLink to="/destination" className={navLinkClass} onClick={closeMenu}>
                Itineraries
              </NavLink>
              <NavLink to="/favourites" className={navLinkClass} onClick={closeMenu}>
                Saved Trips ({favouriteLength})
              </NavLink>
              <NavLink to="/orders" className={navLinkClass} onClick={closeMenu}>
                Booked Trips ({orders.length})
              </NavLink>
              <NavLink to="/aiplanner" className={navLinkClass} onClick={closeMenu}>
                AI Planner
              </NavLink>
              <button type="button" className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass} onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
    </header>
  );
};

export default Header;
