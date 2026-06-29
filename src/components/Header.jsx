import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast";
import { FavouritesContext } from "../context/FavouritesContext";
import { OrdersContext } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { favourites } = useContext(FavouritesContext);
  const { orders } = useContext(OrdersContext);
  const { token, username, setToken } = useAuth();
  const navigate = useNavigate();
  const favouriteLength = favourites.length;

  const handleLogout = () => {
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🏝️</span>
          <span>Travel Planner</span>
        </Link>

        <nav className="nav">
          {token ? (
            <>
              {username && <span className="nav-user">Hi, {username}</span>}
              <NavLink to="/destination" className={navLinkClass}>
                Destinations
              </NavLink>
              <NavLink to="/favourites" className={navLinkClass}>
                Favourites ({favouriteLength})
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                My Orders ({orders.length})
              </NavLink>
              <NavLink to="/aiplanner" className={navLinkClass}>
                AI Planner
              </NavLink>
              <button type="button" className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
