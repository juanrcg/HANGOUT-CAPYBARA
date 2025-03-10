import React, { useState, useContext, useEffect } from "react";
import Feed_Header from "./feed_header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear, faCamera } from "@fortawesome/free-solid-svg-icons";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import AccountContext from "../../Context/AccountContext";

function Settings() {
  const [attribute, setAttribute] = useState(""); // Selected attribute
  const [attribute_value, setAttribute_value] = useState(""); // New value
  const [current_value, setCurrentValue] = useState(""); // Current value
  const [profilePicture, setProfilePicture] = useState(""); // Profile Picture URL
  const [uploadStatus, setUploadStatus] = useState(""); // Upload Status
  const [statusMessage, setStatusMessage] = useState(""); // Status Message (Success/Failure)
  const [statusType, setStatusType] = useState(""); // Status Type (success/error)
  const { updateUser, fetchAttributeValue, getSession } = useContext(AccountContext);

  // Handle attribute selection
  const handleAttributeChange = async (event) => {
    setAttribute(event.target.value);
  };

  // Update attribute value
  const handleUpdate = (event) => {
    event.preventDefault();
    if (!attribute || !attribute_value) {
      alert("Please select an attribute and enter a value.");
      return;
    }

    // Validate phone number if the attribute is 'phone_number'
  if (attribute === "phone_number") {
    const phoneRegex = /^\+\d{1,3}\d{1,4}\d{3,4}\d{4}$/; // Example format: +1-123-456-7890
    if (!phoneRegex.test(attribute_value)) {
     setStatusMessage("Please enter a valid phone number in the format +1XXXXXXXXXX");
      return;
    }
  }

    getSession()
      .then((session) => {
        const email = session.email;
        updateUser(email, attribute, attribute_value)
          .then(() => {
            setStatusMessage("Attribute updated successfully!");
            setStatusType("success");
            console.log("bien");
            setCurrentValue(attribute_value);
          })
          .catch((err) => {
            console.error("Failed to update attribute:", err);
            setStatusMessage("Failed to update. Please try again.");
            setStatusType("error");
          });
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
        setStatusMessage("Failed to fetch session. Try again.");
        setStatusType("error");
      });
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const session = await getSession();
        if (!session || !session.sub) {
          throw new Error("Session or sub is not available.");
        }
        const sub = session.sub;
        setProfilePicture(`https://hangoutdata.s3.amazonaws.com/profile_pictures/${sub}`);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
  
    fetchProfilePicture();
  }, [getSession]); // Only run when getSession changes (on mount or session change)

  // Configure AWS S3 client
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  // Upload file to S3
  const uploadFile = async (file) => {
    try {
      const session = await getSession();
      if (!session || !session.sub) {
        throw new Error("Session or sub is not available.");
      }
      const sub = session.sub;
      setProfilePicture(`https://hangoutdata.s3.amazonaws.com/profile_pictures/${sub}`);
      const params = {
        Bucket: "hangoutdata",
        Key: `profile_pictures/${sub}`,
        Body: file,
        ContentType: file.type,
      };

      const uploader = new Upload({ client: s3Client, params });
      uploader.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadStatus(`Uploaded ${percent}%`);
      });

      const response = await uploader.done();
      setUploadStatus("Upload successful");
      
      return response;
    } catch (error) {
      setUploadStatus("Upload failed");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <Feed_Header />
      <div className="container mt-4">
        <h1 className="main_label text-center mb-4">
          Settings <FontAwesomeIcon icon={faUserGear} />
        </h1>

        <div className="row">
          {/* Profile Picture Upload */}
          <div className="col-md-4">
            <div className="card p-4 bg-dark text-center">
              <img
                src={profilePicture ? profilePicture : "default-profile-pic-url"}  // Default image if profile picture is not available
                alt="Profile"
                className="rounded-circle mb-3"
                width="100"
                height="100"
              />
              <label htmlFor="upload" className="btn btn-secondary">
                <FontAwesomeIcon icon={faCamera} /> Upload Picture
              </label>
              <input
                type="file"
                id="upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => uploadFile(e.target.files[0])}
              />
              <p className="text-white mt-2">{uploadStatus}</p>
            </div>
          </div>

          {/* Settings Form */}
          <div className="col-md-8">
            <div className="settings card p-4 bg-dark">
              <div className="mb-3">
                <label htmlFor="attribute-select" className="form-label">
                  Select Attribute
                </label>
                <select
                  id="attribute-select"
                  value={attribute}
                  onChange={handleAttributeChange}
                  className="form-select"
                >
                  <option value="">Select Attribute</option>
                  <option value="name">Name</option>
                  <option value="phone_number">Phone Number</option>
                  <option value="address">Address</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="new-value" className="form-label">
                  Enter New Value
                </label>
                <input
                  id="new-value"
                  type="text"
                  value={attribute_value}
                  onChange={(e) => setAttribute_value(e.target.value)}
                  placeholder="New Value"
                  className="form-control"
                />
              </div>

              <div className="d-grid">
                <button onClick={handleUpdate} className="btn btn-primary">
                  Update
                </button>
              </div>

              {/* Display Status Message */}
              {statusMessage && (
                <div className={`mt-3 card p-3 ${statusType === "success" ? "bg-success text-white" : "bg-danger text-white"}`}>
                  <p>{statusMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
