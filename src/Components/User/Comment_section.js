import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CommentSection = ({
  commentsState,
  showComments,
  editingCommentId,
  newComment,
  setNewComment,
  handleCreateComment,
  handleEditComment,
  handleSaveEditedComment,
  handleDeleteComment,
  setHoveredCommentId,
  hoveredCommentId,
  setEditedCommentText,
  editedCommentText,
}) => {
  return (
    showComments && (
      <div
        style={{
          marginTop: '20px',
          borderTop: '1px solid #ddd',
          paddingTop: '15px',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {commentsState.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {commentsState.map((comment) => (
              <li
                key={comment.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '15px',
                  backgroundColor: '#2a2a2a',
                  padding: '10px',
                  borderRadius: '8px',
                }}
                onMouseEnter={() => setHoveredCommentId(comment.id)}
                onMouseLeave={() => setHoveredCommentId(null)}
              >
                {/* Display comment text */}
                {editingCommentId === comment.id ? (
                  <textarea
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px',
                      fontSize: '14px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      backgroundColor: '#333',
                      color: '#fff',
                    }}
                  />
                ) : (
                  <p
                    style={{
                      marginBottom: '5px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    {comment.content}
                  </p>
                )}

                {/* Display Author Name */}
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#ccc',
                  }}
                >
                  {comment.ownername}
                </span>

                {/* Actions (Edit and Delete) */}
                {hoveredCommentId === comment.id && (
                  <div
                    style={{
                      marginTop: '5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Edit Button */}
                    {editingCommentId !== comment.id && (
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ff0000',
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>

                    {/* Save Edited Comment Button */}
                    {editingCommentId === comment.id && (
                      <button
                        onClick={handleSaveEditedComment}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#4CAF50',
                        }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'white' }}>No comments yet.</p>
        )}

        {/* Create a New Comment */}
        <div style={{ marginTop: '20px', display: 'flex' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '8px',
              backgroundColor: '#333',
              color: '#fff',
            }}
          />
          <button
            onClick={handleCreateComment}
            style={{
              backgroundColor: '#007bff',
              border: 'none',
              color: '#fff',
              padding: '10px 15px',
              fontSize: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Post
          </button>
        </div>
      </div>
    )
  );
};

export default CommentSection;
