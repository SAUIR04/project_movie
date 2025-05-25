"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { FaUser, FaClock } from "react-icons/fa"
import { toast } from "react-toastify"

const CommentSection = ({ dramaId }) => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  // Load comments from localStorage
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments_${dramaId}`)
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments))
      } catch (error) {
        console.error("Error parsing comments:", error)
        setComments([])
      }
    }
  }, [dramaId])

  // Save comments to localStorage
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_${dramaId}`, JSON.stringify(comments))
    }
  }, [comments, dramaId])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Войдите, чтобы оставить комментарий")
      return
    }

    if (!newComment.trim()) {
      toast.error("Комментарий не может быть пустым")
      return
    }

    setLoading(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        username: user.username,
        userId: user.userId,
        createdAt: new Date().toISOString(),
      }

      setComments([comment, ...comments])
      setNewComment("")
      setLoading(false)
      toast.success("Комментарий добавлен")
    }, 500)
  }

  return (
    <div className="comment-section">
      <h3 className="section-title">Комментарии</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите ваш комментарий..."
            rows={3}
            disabled={loading}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Войдите, чтобы оставить комментарий</p>
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">Нет комментариев. Будьте первым!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-user">
                  <FaUser className="user-icon" />
                  <span>{comment.username}</span>
                </div>
                <div className="comment-date">
                  <FaClock className="clock-icon" />
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="comment-body">
                <p>{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
