import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, BookOpen, Edit, Shield, Pencil, Heart, Star, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

import bg from '../../assets/bg.png';

import './Home.css'
import "tailwindcss"
import { useDarkMode } from '../../contexts/DarkModeContext';
import { toast } from 'react-hot-toast';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [isDark] = useDarkMode();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(true);

  // const toggleTheme = () => {
  //   document.documentElement.classList.toggle('dark-mode');
  // };

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded]);

  // Add this effect to load Playfair Display font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Add loading effect
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Load fonts
  useEffect(() => {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap',
      'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.href = font;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, []);

  // Sample featured articles
  const featuredArticles = [
    {
      id: 1,
      title: "The Art of Creative Writing",
      excerpt: "Discover the secrets of crafting compelling stories that captivate readers from start to finish.",
      author: "Sarah Mitchell",
      category: "Writing Tips",
      readTime: "5 min read",
      icon: <Coffee className="article-icon" />
    },
    {
      id: 2,
      title: "Finding Your Creative Voice",
      excerpt: "Learn how to develop your unique writing style and stand out in the creative world.",
      author: "James Wilson",
      category: "Creativity",
      readTime: "7 min read",
      icon: <Star className="article-icon" />
    },
    {
      id: 3,
      title: "Digital Storytelling",
      excerpt: "Explore modern techniques for engaging your audience through digital platforms.",
      author: "Emma Davis",
      category: "Digital",
      readTime: "6 min read",
      icon: <Heart className="article-icon" />
    }
  ];

  async function onSelectRole(e) {
    // console.log("Role selected:", e.target.value); // Debug log
    setError('');
    const selectedRole = e.target.value;
    
    const allowedAdminEmail = "pavan317.b@gmail.com";
    if (selectedRole === 'admin' && currentUser.email !== allowedAdminEmail) {
      // console.log("admin click chesav")
      setError("Sorry, only the authorized user can be an admin.");
      toast.error("Sorry, only the authorized user can be an admin.")
      return;
    }
    
    try {
      // First, update the currentUser object with the selected role
      const updatedUser = {
        ...currentUser,
        role: selectedRole
      };

      // console.log("Sending request to:", `${BACKEND_URL}/${selectedRole}-api/${selectedRole}`); // Debug log
      
      const res = await axios.post(
        `${BACKEND_URL}/${selectedRole}-api/${selectedRole}`, 
        updatedUser
      );

      // console.log("Response:", res.data); // Debug log

      if (res.data.message === selectedRole) {
        // Show success toast
        toast.success(`Successfully signed in as ${selectedRole}`);
        
        // Update context and localStorage
        setCurrentUser(res.data.payload);
        localStorage.setItem("currentuser", JSON.stringify(res.data.payload));
        
        // Navigate based on role
        switch(selectedRole) {
          case 'user':
            navigate(`/user-profile/${updatedUser.email}`);
            break;
          case 'author':
            navigate(`/author-profile/${updatedUser.email}`);
            break;
          case 'admin':
            navigate(`/admin-profile/${updatedUser.email}`);
            break;
        }
      } else {
        // Show error toast for backend error message
        toast.error(res.data.message);
        setError(res.data.message);
      }
    } catch (err) {
      // Show error toast for any caught errors
      toast.error(err.response?.data?.message || 'Something went wrong');
      setError(err.response?.data?.message || err.message);
    }
  }

  const blogPosts = [
    {
      id: 1,
      title: "Creative Journaling Tips",
      excerpt: "Discover unique ways to express yourself through artistic journaling and sketching.",
      icon: <Pencil className="blog-icon" size={24} />
    },
    {
      id: 2,
      title: "Finding Your Art Style",
      excerpt: "Explore different techniques and mediums to develop your unique artistic voice.",
      icon: <Heart className="blog-icon" size={24} />
    },
    {
      id: 3,
      title: "Digital Art Basics",
      excerpt: "Start your journey into digital art with these beginner-friendly tips.",
      icon: <Star className="blog-icon" size={24} />
    }
  ];

  function loginmsg(){
    toast.error("Login to read Blogs!")
  }

  const GuestHome = () => (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1 className="hero-title">Welcome to DoodleNest</h1>
          <p className="hero-subtitle">Where creativity takes flight and stories come to life</p>
        </motion.div>
      </section>

      {/* Featured Articles Section */}
      <section className="featured-articles">
        <h2 className="section-title">Featured Stories</h2>
        <div className="articles-grid">
          {featuredArticles.map((article, index) => (
            <motion.div 
              key={article.id}
              className="article-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="article-category">{article.category}</div>
              <div className="article-icon-wrapper">
                {article.icon}
              </div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-footer">
                <span className="article-author">By {article.author}</span>
                <span className="article-read-time">{article.readTime}</span>
              </div>
              <button 
                className="read-more-btn"
                onClick={() => toast.error("Please sign in to read full articles!")}
              >
                Read More
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );

  const AuthenticatedHome = () => (
    <div className="authenticated-home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="role-container"
      >
        <h1 className="role-title">Choose Your Creative Path</h1>
        <p className="role-subtitle">How would you like to contribute to our community?</p>

        <div className="role-grid">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="role-card"
            onClick={() => onSelectRole({ target: { value: 'user' }})}
          >
            <div className="role-icon-wrapper">
              <BookOpen className="role-icon" />
            </div>
            <h3 className="role-name">Reader</h3>
            <p className="role-description">
              Explore and enjoy articles from our talented authors
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="role-card"
            onClick={() => onSelectRole({ target: { value: 'admin' }})}
          >
            <div className="role-icon-wrapper">
              <Edit className="role-icon" />
            </div>
            <h3 className="role-name">Admin</h3>
            <p className="role-description">
              Share your stories and inspire others
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="role-card"
            onClick={() => onSelectRole({ target: { value: 'author' }})}
          >
            <div className="role-icon-wrapper">
              <Edit className="role-icon" />
            </div>
            <h3 className="role-name">Author</h3>
            <p className="role-description">
              Share your stories and inspire others
            </p>
          </motion.div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
  

  return (
    <main className="relative">
      {isSignedIn ? (
        <AuthenticatedHome />
      ) : (
        <GuestHome />
      )}
    </main>
  );
}

export default Home;