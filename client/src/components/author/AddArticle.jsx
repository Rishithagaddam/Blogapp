import React, { useState } from 'react'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, FileText, ListFilter, PenLine } from 'lucide-react'
import { toast } from 'react-hot-toast'
import './AddArticle.css'

function AddArticle() {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: 'Technology'
  })
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!article.title.trim() || !article.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const token = await getToken()
      
      // Create the request payload with all required fields including author data
      const currentDate = new Date().toISOString()
      const payload = {
        title: article.title.trim(),
        content: article.content.trim(),
        category: article.category,
        dateOfCreation: currentDate,
        dateOfModification: currentDate,
        isArticleActive: true,
        articleId: Date.now().toString(),
        authorData: {
          nameOfAuthor: user.fullName || user.firstName + ' ' + user.lastName,
          profileImageUrl: user.imageUrl,
          email: user.primaryEmailAddress.emailAddress
        }
      }

      const response = await axios.post(
        `${BACKEND_URL}/author-api/article`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.data) {
        toast.success('Article posted successfully!')
        navigate('/author-profile/articles')
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      toast.error(
        err.response?.data?.message || 
        'Failed to post article. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-article">
      <div className="post-article-container">
        <h2 className="post-article-title">
          <PenLine className="title-icon" />
          Write an Article
        </h2>
        
        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label htmlFor="title">
              <FileText className="input-icon" />
              Title
            </label>
            <input
              type="text"
              id="title"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              placeholder="Enter article title"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              <ListFilter className="input-icon" />
              Select a category
            </label>
            <select
              id="category"
              value={article.category}
              onChange={(e) => setArticle({ ...article, category: e.target.value })}
              className="form-select"
            >
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Health">Health</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <PenLine className="input-icon" />
              Content
            </label>
            <textarea
              id="content"
              value={article.content}
              onChange={(e) => setArticle({ ...article, content: e.target.value })}
              placeholder="Write your article content here..."
              required
              className="form-textarea"
              rows="12"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            <Send className="button-icon" />
            {loading ? 'Posting...' : 'Post'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default AddArticle;