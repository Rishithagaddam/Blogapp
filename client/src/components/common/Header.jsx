import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { motion } from 'framer-motion';
import logo from '../../assets/logo3.webp';
import './Header.css';

const Header = () => {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <motion.img 
            src={logo} 
            alt="DoodleNest" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="logo-image"
          />
          <motion.span 
            className="logo-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            DoodleNest
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {!isSignedIn ? (
            <div className="auth-buttons">
              <Link 
                to="/signin"
                className="auth-button signin-button"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="auth-button signup-button"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="user-profile">
              <div className="user-image-container">
                <img 
                  src={user.imageUrl}
                  alt={user.firstName}
                  className="user-avatar"
                />
                {currentUser?.role && (
                  <span className="user-role">
                    {currentUser.role}
                  </span>
                )}
              </div>
              <span className="username">
                {user.firstName}
              </span>
              <button
                onClick={handleSignOut}
                className="signout-button"
              >
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;