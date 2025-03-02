import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { FaEdit, FaSave, FaCommentAlt, FaUser, FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import './ArticleByID.css'

function ArticleByID() {
  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [currentArticle, setCurrentArticle] = useState(state)
  const [commentStatus, setCommentStatus] = useState('')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Original functions remain unchanged
  function enableEdit() {
    setEditArticleStatus(true)
  }

  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...currentArticle, ...modifiedArticle }
    const token = await getToken()
    const currentDate = new Date();
    articleAfterChanges.dateOfModification = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()

    let res = await axios.put(`${BACKEND_URL}/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

    if (res.data.message === 'article modified') {
      setEditArticleStatus(false);
      setCurrentArticle(res.data.payload)
      navigate(`/author-profile/articles/${currentArticle.articleId}`, { state: res.data.payload })
    }
  }

  async function addComment(commentObj) {
    commentObj.nameOfUser = currentUser.firstName;
    let res = await axios.put(`${BACKEND_URL}/user-api/comment/${currentArticle.articleId}`, commentObj);
    if (res.data.message === 'comment added') {
      setCommentStatus(res.data.message)
      setCurrentArticle(res.data.payload)
      reset();
    }
  }

  async function deleteArticle() {
    const articleToUpdate = { ...currentArticle, isArticleActive: false };
    let res = await axios.put(`${BACKEND_URL}/author-api/articles/${currentArticle.articleId}`, articleToUpdate)
    if (res.data.message === 'article deleted or restored') {
      setCurrentArticle(res.data.payload)
    }
  }

  async function restoreArticle() {
    const articleToUpdate = { ...currentArticle, isArticleActive: true };
    let res = await axios.put(`${BACKEND_URL}/author-api/articles/${currentArticle.articleId}`, articleToUpdate)
    if (res.data.message === 'article deleted or restored') {
      setCurrentArticle(res.data.payload)
    }
  }

  return (
    <div className="article-page">
      <div className="article-container">
        {editArticleStatus === false ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="article-content"
          >
            <div className="article-header">
              <div className="header-content">
                <h1 className="article-title">{currentArticle.title}</h1>
                <div className="article-dates">
                  <span className="date-item">
                    <FaCalendarAlt className="icon" />
                    Created: {currentArticle.dateOfCreation}
                  </span>
                  <span className="date-item">
                    <FaCalendarAlt className="icon" />
                    Modified: {currentArticle.dateOfModification}
                  </span>
                </div>
              </div>

              <div className="author-section">
                <div className="author-info">
                  <img
                    src={currentArticle.authorData.profileImageUrl}
                    className="author-image"
                    alt={currentArticle.authorData.nameOfAuthor}
                  />
                  <p className="author-name">{currentArticle.authorData.nameOfAuthor}</p>
                </div>

                {currentUser.role === 'author' && (
                  <div className="action-buttons">
                    <button className="icon-button edit" onClick={enableEdit}>
                      <FaEdit />
                    </button>
                    {currentArticle.isArticleActive ? (
                      <button className="icon-button delete" onClick={deleteArticle}>
                        <MdDelete />
                      </button>
                    ) : (
                      <button className="icon-button restore" onClick={restoreArticle}>
                        <MdRestore />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="article-body">
              <p>{currentArticle.content}</p>
            </div>

            <div className="comments-section">
              <h2 className="comments-title">
                <FaCommentAlt className="icon" />
                Comments
              </h2>
              
              <div className="comments-list">
                {currentArticle.comments.length === 0 ? (
                  <p className="no-comments">No comments yet...</p>
                ) : (
                  currentArticle.comments.map(commentObj => (
                    <div key={commentObj._id} className="comment-card">
                      <p className="comment-author">{commentObj?.nameOfUser}</p>
                      <p className="comment-text">{commentObj?.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {commentStatus && (
                <div className="comment-status">{commentStatus}</div>
              )}

              {currentUser.role === 'user' && (
                <form onSubmit={handleSubmit(addComment)} className="comment-form">
                  <input
                    type="text"
                    {...register("comment")}
                    className="comment-input"
                    placeholder="Add a comment..."
                  />
                  <button type="submit" className="comment-button">
                    <FaCommentAlt className="icon" />
                    Add Comment
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSave)} className="edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                defaultValue={currentArticle.title}
                {...register("title")}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                {...register("category")}
                className="form-select"
                defaultValue={currentArticle.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                {...register("content")}
                className="form-textarea"
                rows="10"
                defaultValue={currentArticle.content}
              />
            </div>

            <button type="submit" className="save-button">
              <FaSave className="icon" />
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ArticleByID