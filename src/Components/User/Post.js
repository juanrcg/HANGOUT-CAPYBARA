import React, { useState , useContext, useEffect } from "react";
import { useWebSocket } from '../../Context/WebSocketContext';
import AccountContext from '../../Context/AccountContext';
import MediaCarousel from "./MediaCarousel"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import CommentSection from "./Comment_section";

const Post = ({ data, userPhoto, userName }) => {
  const { getSession } = useContext(AccountContext);
  const { socket,receivedRecomendations } = useWebSocket();
  const [author, setAuthor] = useState(null);
  const [ownername, setOwnername] = useState("");

  const {
    id = "",
    content = "",
    fontFamily = "Arial, sans-serif",
    fontStyle = {},
    fontColor = "#fff",
    selectedProduct = {},
    files = [],
    likes = [], // Likes as an array
    comments = [],
    pauthor = "",
  } = data || {};

  const [matchingRecommendations, setMatchingRecommendations] = useState([]);

  // Update recommendations when receivedRecommendations change
  useEffect(() => {
    const filteredRecommendations = receivedRecomendations.filter(
        (recommendation) => recommendation.id == id
    );
    setMatchingRecommendations(filteredRecommendations);
}, [receivedRecomendations,id]); // Runs whenever recommendations or post ID change


  const parsedFiles = Array.isArray(files) ? files : [];
  const imageFiles = parsedFiles.filter(
    (file) => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")|| file.endsWith(".webp")|| file.endsWith(".JPG")
  );

  
  const videoFiles = parsedFiles.filter(
    (file) =>
      file.endsWith(".mp4") ||
      file.endsWith(".webm") ||
      file.endsWith(".ogg") ||
      file.endsWith(".mov")||
      file.endsWith(".MOV")
  );

  const mediaFiles = [
    ...imageFiles.map((file) => ({ type: "image", src: file })),
    ...videoFiles.map((file) => ({ type: "video", src: file })),
  ];

  useEffect(() => {
    if (author && Array.isArray(likes)) {
      // Check if the user has liked the post based on the author field
      const hasLiked = likes.some(like => like.author === author);
      setLikedByUser(hasLiked);
    }
  }, [author, likes]); // Re-run when author or likes changes

  useEffect(() => {
    getSession()
      .then(session => {
        setAuthor(session.sub); // Store the session 'sub' as author
        setOwnername(session.name); // Store the session 'name' as ownername
      })
      .catch(err => console.log(err));
  }, []); // Run only once when the component mounts

  const [showProductDescription, setShowProductDescription] = useState(false);
  const [commentsState, setCommentsState] = useState(comments || []);  // Fallback to an empty array if comments is null or undefined
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null); // Track which comment is being edited
  const [editedCommentText, setEditedCommentText] = useState("");
  const [likesCount, setLikesCount] = useState(likes ? likes.length : 0);
  // Check if the user already liked the post

const [likedByUser, setLikedByUser] =useState(false);
  const [modalImage, setModalImage] = useState(null);

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc);
  };
  
  const closeModal = () => {
    setModalImage(null);
  };

 

  const handleLikeToggle = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const action = likedByUser ? "eliminatelike" : "addlike";

      const body = {
        action,
        id: id,
        author: author, // Replace with the actual current user
      };

      socket.send(JSON.stringify(body));
      console.log(`Sent "${action}" action to WebSocket`, id);

      // Update local state for likes
      setLikedByUser(!likedByUser);
      setLikesCount((prevCount) => (likedByUser ? prevCount - 1 : prevCount + 1));
    }
  };

// Create a new comment
const handleCreateComment = () => {
  if (newComment.trim() === "") return; // Avoid empty comments

  const newCommentData = {
    text: newComment,
    author: author, // Assuming you have the author session
    ownername: ownername,
  };

  const body ={
    action: "addcomment",
    id: id,
    author: author,
    ownername: ownername,
    content: newComment,
  }

  if (socket && socket.readyState === WebSocket.OPEN) {

    socket.send(JSON.stringify(body));

  }



  //Update comments state by appending the new comment
    setCommentsState((prevComments) => [...prevComments, newCommentData]);

  // Clear the input field
  setNewComment("");
};

// Edit a comment
const handleEditComment = (commentId) => {
  const commentToEdit = commentsState.find((comment) => comment.id === commentId);
  if (commentToEdit) {
    setEditingCommentId(commentId); // Set the comment to be edited
    setEditedCommentText(commentToEdit.content); // Set the comment text to be edited
  }
};

// Save the edited comment
const handleSaveEditedComment = () => {
  if (editedCommentText.trim() === "") return; // Avoid saving empty text

  const body ={
    action: "editcomment",
    postId: id,
    commentId: editingCommentId,
    author: author,
    ownername: ownername,
    newContent: editedCommentText,
  }

  if (socket && socket.readyState === WebSocket.OPEN) {

    socket.send(JSON.stringify(body));

  }

  

  const updatedComments = commentsState.map((comment) =>
    comment.id === editingCommentId
      ? { ...comment, content: editedCommentText }
      : comment
  );

  // Update the comments state with the edited comment
  setCommentsState(updatedComments);

  // Clear the editing states
  setEditingCommentId(null);
  setEditedCommentText("");
};

// Delete a comment
const handleDeleteComment = (commentId) => {

  const body ={
    action:"eliminatecomment",
    postId: id,
    commentId : commentId,
    author: author,
  };

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(body));
  }
  const updatedComments = commentsState.filter((comment) => comment.id !== commentId);

  // Update the comments state after deletion
  setCommentsState(updatedComments);
};

  const contentStyle = {
    fontFamily,
    fontWeight: fontStyle.bold ? "bold" : "normal",
    fontStyle: fontStyle.italic ? "italic" : "normal",
    textDecoration: fontStyle.underline ? "underline" : "none",
    color: fontColor === "#000000" ? "#ffffff" : fontColor,
    fontSize: fontStyle.size || "16px",
    marginTop: imageFiles.length === 0 && videoFiles.length === 0 ? "60px" : "20px",
  };
  


  // Function to handle redirect
const handleBuyNowClick = () => {

  console.log(selectedProduct);
 
    // Construct the URL with the owner's username
    const redirectUrl = `https://hangiando.netlify.app/oinventory?username=${selectedProduct.owner}`;
    // Redirect to the URL
    window.open(redirectUrl, "_blank");  // This opens in a new tab.

};




  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#1A1A1A",
        position: "relative",
      }}
    >
      {/* User Section */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: 10,
        }}
      >
        <img
          src={`https://hangoutdata.s3.amazonaws.com/profile_pictures/${pauthor}`}
          alt={`${userName}'s photo`}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "5px",
          }}
        />
        <p
          style={{
            marginBottom: "0",
            fontWeight: "bold",
            color: "white",
            fontSize: "14px",
          }}
        >
          {userName}
        </p>
      </div>

     {/* Media Files Section */}
{(imageFiles.length > 0 || videoFiles.length > 0) && (
  <div
    style={{
      marginTop: "15px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%", // Responsive width
      maxWidth: "500px", // Prevents it from getting too large
      height: "auto", // Adjust height dynamically while keeping aspect ratio
      maxHeight: "400px", // Ensures videos don’t get too big
      overflow: "hidden",
      borderRadius: "8px",
      backgroundColor: "#000",
      margin: "0 auto", // Centers the div
    }}
  >
    {mediaFiles.length > 1 ? (
      <MediaCarousel mediaFiles={mediaFiles} openImageModal={openImageModal} />
    ) : (
      mediaFiles[0].type === "image" ? (
        <img
          src={mediaFiles[0].src}
          alt="Post Media"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "400px", // Ensures images don't stretch
            objectFit: "contain", // Keeps aspect ratio intact
            cursor: "pointer",
          }}
          onClick={() => openImageModal(mediaFiles[0].src)}
        />
      ) : (
        <video
          controls
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "400px",
            borderRadius: "8px",
            objectFit: "contain",
          }}
        >
          <source src={mediaFiles[0].src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    )}
  </div>
)}

      {/* Content Section */}
      <div style={contentStyle}>{content}</div>

       {/* Image Modal */}
       {modalImage && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={modalImage}
            alt="Full Size"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
          backgroundColor: "#000000",
          padding: "10px 0",
          position: "sticky",
          bottom: "0",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={handleLikeToggle}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: likedByUser ? "#ffcc00" : "white",
              fontSize: "24px",
            }}
          >
            <i className="fas fa-martini-glass-citrus" />
            {likesCount > 0 && (
              <span style={{ marginLeft: "5px", color: "white" }}>{likesCount}</span>
            )}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "24px",
            }}
          >
            <i className="fas fa-comment-dots" />
          </button>
        </div>

        <button
          onClick={() => setShowProductDescription(!showProductDescription)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "24px",
            zIndex: 1,
          }}

          
        >

          {showProductDescription ? (
            <i className="fas fa-chevron-down" />
          ) : (
            <i className="fas fa-chevron-right" />
          )}
        </button>
        
        
      </div>

      {/*Comment Section*/}
 

  <CommentSection
  commentsState={commentsState}
  showComments={showComments}
  editingCommentId={editingCommentId}
  newComment={newComment}
  setNewComment={setNewComment}
  handleCreateComment={handleCreateComment}
  handleEditComment={handleEditComment}
  handleSaveEditedComment={handleSaveEditedComment}
  handleDeleteComment={handleDeleteComment}
  setHoveredCommentId={setHoveredCommentId}
  hoveredCommentId={hoveredCommentId}
  setEditedCommentText={setEditedCommentText}
  editedCommentText={editedCommentText}
/>


      {/* Product Section */}
      {showProductDescription && selectedProduct && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
            color: "white",
            textAlign: "right",
            marginTop: "10px",
            position: "absolute",
            bottom: "50px",
            right: "10px",
            zIndex: 10,
            minWidth: "200px",
          }}
        >
          <p style={{ marginBottom: "10px" }}>{selectedProduct.name}</p>
          <p style={{ marginBottom: "10px" }}>{selectedProduct.description}</p>
          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Price: ${selectedProduct.price}
          </p>
          <button
           onClick={handleBuyNowClick} // Here you call the function
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Buy Now
          </button>
        </div>
      )
      }
      {showProductDescription && matchingRecommendations.length > 0 && (
    <div
        style={{
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
            color: "white",
            marginTop: "10px",
            width: "100%",
        }}
    >
        <h4>Recommended Products:</h4>
        {matchingRecommendations.map((rec, index) => (
            <div
                key={index}
                style={{
                    padding: "10px",
                    marginBottom: "10px",
                    borderBottom: "1px solid #444",
                }}
            >
                {rec.suggestion ? (
                    // Render clickable Amazon link
                    <a
                        href={rec.suggestion}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#007bff", textDecoration: "none" }}
                    >
                        View Product on Amazon
                    </a>
                ) : (
                    // Render product details (if available)
                    <div>
                        <p><strong>{rec.name}</strong></p>
                        <p>{rec.description}</p>
                        <p style={{ fontWeight: "bold" }}>Price: ${rec.price}</p>
                        <button
                          
                          style={{
                            padding: "8px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={handleBuyNowClick} // Here you call the function
                        >
                          Buy Now
                        </button>

                    </div>
                )}
            </div>
        ))}
    </div>
)}
    </div>
  );
};

export default Post;
