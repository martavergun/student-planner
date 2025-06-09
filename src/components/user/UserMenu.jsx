import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

const UserMenu = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      setOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setOpen(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      {/* Desktop Avatar */}
      <div className="avatar" onClick={toggleMenu}>
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="user" className="avatar-img" />
        ) : (
          <div className="avatar-initial">
            {currentUser?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div 
        className={`hamburger-menu ${open ? 'open' : ''}`} 
        onClick={toggleMenu}
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="menu-dropdown">
          <button onClick={handleProfileClick}>Профіль</button>
          <button onClick={handleLogout}>Вийти</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
