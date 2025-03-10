import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Feed_Header from "../User/feed_header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import AccountContext from "../../Context/AccountContext";

function Oprofile() {
  const { sub } = useParams();
  const { cognitoIdentityServiceProvider } = useContext(AccountContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (!cognitoIdentityServiceProvider) {
        console.error("Cognito provider is missing.");
        setError("Failed to load user data.");
        return;
      }

      try {
        const params = {
          UserPoolId: "us-east-1_E4tHXcNqJ",
          Filter: `sub = "${sub}"`,
          AttributesToGet: ["email", "name", "photo_url"],
        };

        const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
        const userData = data.Users[0];

        if (userData) {
          const emailAttribute = userData.Attributes.find(attr => attr.Name === "email");
          const nameAttribute = userData.Attributes.find(attr => attr.Name === "name");
          const photoAttribute = userData.Attributes.find(attr => attr.Name === "photo_url");

          setUser({
            name: nameAttribute ? nameAttribute.Value : "Unknown User",
            email: emailAttribute ? emailAttribute.Value : "No email provided",
            profilePicture: photoAttribute ? photoAttribute.Value : "https://via.placeholder.com/150",
          });
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Error retrieving user:", err);
        setError("Failed to load user data.");
      }
    };

    getUserData();
  }, [sub, cognitoIdentityServiceProvider]);

  return (
    <>
      <Feed_Header />

      <div
        className="container p-4 mt-4 shadow rounded"
        style={{
          maxWidth: "900px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
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

            <div className="mb-4">
              <h5>Bio</h5>
              <p className="text-muted">This is where your bio will go. Write something about yourself!</p>
            </div>

            <div className="mb-4">
              <h5>User Posts</h5>
              <div className="d-flex justify-content-center align-items-center">
                <div
                  className="p-5 border rounded text-muted"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    backgroundColor: "#222",
                  }}
                >
                  <p>No posts yet! Start by sharing something with your friends.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="btn btn-outline-light">
                <FontAwesomeIcon icon={faUserGear} className="me-2" />
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Oprofile;
