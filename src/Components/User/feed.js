import React, { useEffect, useContext } from 'react';
import Feed_Header from './feed_header';
import Footer from '../footer';
import Bar from './Bar';
import Post from './Post';
import defaultUserPhoto from '../Chat/default_image.png'; // Replace with path to a default icon
import { useWebSocket } from '../../Context/WebSocketContext';
import AccountContext from '../../Context/AccountContext';

function Feed() {
    const { socket, receivedPosts } = useWebSocket(); // Get receivedPosts from WebSocketContext
    const { getSession } = useContext(AccountContext);
    let owner = 'admin';
    let analize_post = [];

    useEffect(() => {
        // Prepare the array of posts to send for analysis
        const analyzePosts = receivedPosts.map((post) => {
          // Parse files and filter by image formats
          const parsedFiles = post.files ? post.files : [];
          const imageFiles = parsedFiles.filter(
            (file) => file.endsWith(".jpg")|| file.endsWith(".jpeg") || file.endsWith(".png"));
      
          // Only add the post to analyze if there are image files
          if (imageFiles.length > 0) {
            return {
              postId: post.id, // Include postId for reference
              imageUrl: imageFiles[0], // Only the first image for the post
            };
          }
      
          // Return null if no valid image files are found (to avoid empty entries)
          return null;
        }).filter(Boolean); // Remove null values from the final array
      
        // Send images for analysis if we have any valid posts to analyze
        if (analyzePosts.length > 0) {
          console.log(analyzePosts);
          analyzeImage(analyzePosts);
        }
      }, [receivedPosts]);
      
      // Function to send the analyze request through the socket
      async function analyzeImage(postArray) {
        try {
          if (socket && socket.readyState === WebSocket.OPEN) {
            const body = {
              action: "analyze",
              analyze_post: postArray,
            };
            socket.send(JSON.stringify(body));
            console.log('Images sent for analysis:', postArray);
          }
        } catch (error) {
          console.error("Error sending images for analysis:", error);
        }
      }

     

    useEffect(() => {
        // Send the "getposts" action only once when the component mounts and socket is open
        if (socket && socket.readyState === WebSocket.OPEN) {
            let body = {
                action: 'getposts',
            };
            socket.send(JSON.stringify(body));
           // console.log('Sent "getposts" action to WebSocket');

            getSession()
                .then(session => {
                    owner = session.sub; // Establecer el sender después de obtener la sesión
                    body = {
                        action: 'getproducts',
                        owner: owner,
                    };
                    socket.send(JSON.stringify(body));
                    console.log(`Sent "getproducts" action to WebSocket ${owner}`)
                
                })
                .catch(err => {
                    console.log(err);
                });

           ;




        }
    }, [socket]); // Only re-run if `socket` changes

    return (
        <>
            <Feed_Header />
            <Bar />
            <div className="posts-container">
                {receivedPosts.length > 0 ? (
                    receivedPosts.map((post, index) => (
                        <Post
                            key={index}
                            data={{
                                id: post.id,
                                content: post.content,
                                fontFamily: post.fontFamily,
                                fontStyle: post.fontStyle,
                                fontColor: post.fontColor,
                                selectedProduct: JSON.parse(post.selectedProduct),
                                author: post.author,
                                files: post.files,
                                comments: post.comments,
                                likes: post.likes,
                            }}
                            userPhoto={defaultUserPhoto} // Replace with user-specific photo if available
                            userName={post.ownername} // Use the author's name
                        />
                    ))
                ) : (
                    <p>No posts available yet.</p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Feed;
