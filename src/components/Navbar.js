import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌐</span>
          <span>
            Sam<span className="brand-accent">Verse</span>
          </span>
        </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/jobs"
            className={`nav-link ${isActive("/jobs")}`}
            onClick={() => setMenuOpen(false)}
          >
            Browse Jobs
          </Link>
          {user && user.role === "USER" && (
            <Link
              to="/my-applications"
              className={`nav-link ${isActive("/my-applications")}`}
              onClick={() => setMenuOpen(false)}
            >
              My Applications
            </Link>
          )}
          {user && user.role === "ADMIN" && (
            <Link
              to="/admin"
              className={`nav-link ${isActive("/admin")}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {user ? (
            <div className="nav-user-area">
              <Link
                to="/profile"
                className="nav-profile-btn"
                onClick={() => setMenuOpen(false)}
              >
                <span className="avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span>{user.name}</span>
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-area">
              <Link
                to="/login"
                className="btn-login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-signup"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
