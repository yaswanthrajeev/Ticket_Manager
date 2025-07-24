import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function CommentSection({ ticketId, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tickets/${ticketId}/comments`, { 
        withCredentials: true 
      });
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/tickets/${ticketId}/comments`, 
        { content: newComment.trim() },
        { withCredentials: true }
      );
      
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      setError('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`${BASE_URL}/comments/${commentId}`, { 
        withCredentials: true 
      });
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">Comments & Discussion</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <div className="comment-input-group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
            rows="3"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary btn-sm"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className={`comment-card ${comment.is_admin ? 'admin-comment' : 'user-comment'}`}>
              <div className="comment-header">
                <div className="comment-author">
                  <span className="author-name">{comment.author}</span>
                  {comment.is_admin && <span className="admin-badge">Admin</span>}
                </div>
                <div className="comment-meta">
                  <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                  {comment.can_delete && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-comment-btn"
                      title="Delete comment"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection; 