import React, { useEffect, useState, useContext } from "react";
import Feed_Header from "./feed_header";
import AccountContext from "../../Context/AccountContext";
import { useWebSocket } from '../../Context/WebSocketContext';
import Bar from "./Bar";
import Post from "./Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const { socket, receivedPosts_su } = useWebSocket();
  const { getSession,  cognitoIdentityServiceProvider } = useContext(AccountContext);
  const [user, setUser] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  useEffect(() => {
    // Fetch user details from Cognito
    const getUserDetailsBySub = async (sub) => {
      try {
        const params = {
            UserPoolId: "us-east-1_E4tHXcNqJ", // Replace with your actual User Pool ID
            Username: sub  // The sub is used as the username
        };

        // Fetch user details based on sub
        const data = await cognitoIdentityServiceProvider.adminGetUser(params).promise();

        // Extract email from the user's attributes
        const nameAttribute =  data.UserAttributes.find(attr => attr.Name === 'name');
        const emailAttribute = data.UserAttributes.find(attr => attr.Name === 'email');
        
        if (emailAttribute) {
            const email = emailAttribute.Value? emailAttribute.Value: "none";
            const name = nameAttribute.Value? nameAttribute.Value: "none" ;
             // Update user state
             return { name, email }; ;
        } else {
            console.log("Email not found for the given sub");
            return null;
        }
    } catch (error) {
        console.error('Error fetching user by sub:', error);
        return null;
    }
  };

    if (username) {

      getUserDetailsBySub(username).then(userDetails => {
        if (userDetails) {
            const { email, name } = userDetails;
            setUser({
              name: name,
              email : email,
              profilePicture: `https://hangoutdata.s3.amazonaws.com/profile_pictures/${username}`, 

            })
        }
    });
    }
 

    // Send "getposts_su" action when the socket is open
    if (socket && socket.readyState === WebSocket.OPEN) {
      getSession()
        .then(session => {
          const owner = session.sub;
          const body = {
            action: 'getposts_su',
            owner: username,
           
          };
          socket.send(JSON.stringify(body));
          console.log(`Sent "getposts_su" action to WebSocket for ${owner}`);
        })
        .catch(err => console.log(err));
    }
  }, [socket, username]); // Runs only when socket or username changes

  return (
    <>
        <Feed_Header />
      <div
        className="container p-4 mt-4 shadow rounded"
        style={{
          maxWidth: "900px",
          backgroundColor: "#000", // Dark background
          color: "#fff", // Light text
        }}
      >
        {/* Profile Section */}
        <div className="d-flex align-items-center mb-4">
          <img
            src={user ? user.profilePicture : `https://hangoutdata.s3.amazonaws.com/profile_pictures/${username}`}
            alt="Profile"
            className="rounded-circle me-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <div>
            <h2>{user ? user.name : "Loading..."}</h2>
              <p className="text-gray-200 bg-gray-800 p-2 rounded font-semibold text-lg">
                {user ? user.email : "Loading..."}
              </p>
            </div>
          <a 
  className="me-3 text-white text-decoration-none" 
  href={ `/oinventory?username=${username}&email=${user? user.email:"error"}`}
  id="Oinventory"
>
  <FontAwesomeIcon icon={faBox} size="lg" /> {/* Inventory Icon */}
</a>

<a 
  className="me-3 text-white text-decoration-none" 
  href={`/message_box?selectedSenderSub=${username}&selectedSender=${user? user.email:"error"}` }
  id="messageBox"
>
  <FontAwesomeIcon icon={faEnvelope} size="lg" /> {/* Message Box Icon */}
</a>
        </div>

    
      <Bar /> {/* Added the Bar component just below the Feed_Header */}

        {/* Posts Section */}
        <div className="mb-4">
          <h5>Your Posts</h5>
          <div className="posts-container">
            {receivedPosts_su.length > 0 ? (
              receivedPosts_su
                .filter((post, index, self) => self.findIndex(p => p.id === post.id) === index) // Remove duplicates
                .map((post, index) => (
                  <Post
                    key={post.id} // Using post.id as the key
                    data={{
                      id: post.id,
                      content: post.content,
                      fontFamily: post.fontFamily,
                      fontStyle: post.fontStyle,
                      fontColor: post.fontColor,
                      selectedProduct: JSON.parse(post.selectedProduct),
                      pauthor: post.author,
                      files: post.files,
                      comments: post.comments,
                      likes: post.likes,
                    }}
                    userPhoto={`https://hangoutdata.s3.amazonaws.com/profile_pictures/${username}`} 
                    userName={post.ownername} 
                  />
                ))
            ) : (
              <p>No posts available yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
