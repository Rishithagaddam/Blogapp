import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Book, Clock, Tag, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import './Articles.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Get current user role from context
  const { currentUser } = useContext(userAuthorContextObj);
  const isAuthor = currentUser?.role === 'author';

  const fetchArticles = async (category = '') => {
    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      let url = `${BACKEND_URL}/author-api/articles`;
      if (category && category.trim() !== '') {
        url = `${BACKEND_URL}/author-api/articles/filter/${category}`;
      }

      const response = await axios.get(url, { 
        headers,
        timeout: 5000,
        validateStatus: status => status >= 200 && status < 300
      });
      
      if (response.data && Array.isArray(response.data.payload)) {
        const processedArticles = response.data.payload.map(article => ({
          ...article,
          authorData: article.authorData || {
            nameOfAuthor: 'Anonymous',
            profileImageUrl: '/default-avatar.png'
          }
        }));
        setArticles(processedArticles);
      } else {
        setArticles([]);
        setError('No articles found for this category');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch articles');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to fetch articles. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    navigate(`/article/${article.articleId}`, { state: article });
  };

  // Handle navigation to PostArticle page
  const handleAddArticle = () => {
    navigate('/articles/add-article'); // This should match your route configuration
  };

  const handleCategoryChange = async (selectedCategory) => {
    try {
      await fetchArticles(selectedCategory);
    } catch (error) {
      console.error('Error changing category:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="articles-page">
        <div className="articles-container">
          <div className="loading-state">Loading articles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-page">
        <div className="articles-container">
          <div className="error-state">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="articles-container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="articles-header"
        >
          <div className="header-title">
            <Book className="text-[#FF3131] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#EAEAEA]">Articles</h1>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleCategoryChange(e.target.value === 'All Categories' ? '' : e.target.value);
            }}
            className="category-select"
          >
            <option>All Categories</option>
            <option>Technology</option>
            <option>Science</option>
            <option>Health</option>
            <option>Business</option>
          </select>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="articles-grid"
        >
          {articles.map((article, index) => (
            <motion.article
              key={article.articleId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="article-card"
              onClick={() => handleArticleClick(article)}
            >
              <div className="article-content">
                <div className="article-meta">
                  <span className="author-avatar">
                    {article.authorData?.nameOfAuthor?.charAt(0) || 'A'}
                  </span>
                  <div className="meta-info">
                    <span className="author-name">
                      {article.authorData?.nameOfAuthor || 'Anonymous'}
                    </span>
                    <span className="article-date">
                      <Clock className="inline w-4 h-4" />
                      {/* Fixed date formatting */}
                      {new Date(article.dateOfCreation).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <h2 className="article-title">{article.title}</h2>
                <p className="article-text">
                  {article.content?.substring(0, 150)}...
                </p>
                
                <div className="article-footer">
                  <span className="category-tag">
                    <Tag className="inline w-4 h-4" />
                    {article.category}
                  </span>
                  <button className="read-more">
                    Read More →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Add Article Button for Authors */}
        {isAuthor && (
          <motion.button
            className="add-article-btn"
            onClick={handleAddArticle}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle />
            Add Article
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default Articles;