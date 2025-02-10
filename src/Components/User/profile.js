import React, { useEffect, useState, useContext } from "react";
import Feed_Header from "../User/feed_header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import AccountContext from "../../Context/AccountContext";

function Profile() {
  const { getSession } = useContext(AccountContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSession()
      .then((session) => {
        // Assuming session contains user data
        setUser({
          name: session.name || "John Doe",
          email: session.email || "johndoe@example.com",
          profilePicture: session.profilePicture || "https://via.placeholder.com/150", // Placeholder if no profile picture
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getSession]);

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
            src={user ? user.profilePicture : "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-circle me-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <div>
            <h2>{user ? user.name : "Loading..."}</h2>
            <p className="text-muted">{user ? user.email : "Loading..."}</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-4">
          <h5>Bio</h5>
          <p className="text-muted">This is where your bio will go. Write something about yourself!</p>
        </div>

        {/* Posts Section (Placeholder for now) */}
        <div className="mb-4">
          <h5>Your Posts</h5>
          <div className="d-flex justify-content-center align-items-center">
            <div
              className="p-5 border rounded text-muted"
              style={{
                width: "100%",
                maxWidth: "500px",
                backgroundColor: "#222", // Dark background for post area
              }}
            >
              <p>No posts yet! Start by sharing something with your friends.</p>
            </div>
          </div>
        </div>

        {/* Account Settings Button */}
        <div className="text-center">
          <button className="btn btn-outline-light">
            <FontAwesomeIcon icon={faUserGear} className="me-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
