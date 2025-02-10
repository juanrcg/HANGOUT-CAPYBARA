import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Feed_Header from "../User/feed_header";

const Party = () => {
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [danceRequests, setDanceRequests] = useState([]); // Stores dance requests

  const [peopleHanging, setPeopleHanging] = useState([
    { name: "Samantha", gender: "Female", location: "Club X", openToTalk: true, openToDance: false },
    { name: "Mike", gender: "Male", location: "Bar Y", openToTalk: false, openToDance: true },
    { name: "Emma", gender: "Female", location: "Lounge Z", openToTalk: true, openToDance: true },
    { name: "Liam", gender: "Male", location: "Club X", openToTalk: false, openToDance: false },
  ]);

  const currentUser = {
    name: "Juan", // Replace with actual user data
    gender: "Male", // Replace with actual user data
    location: "VIP Lounge", // Replace with actual user location
  };

  const togglePartyMode = () => {
    setIsPartyMode(!isPartyMode);
    if (!isPartyMode) {
      setPeopleHanging([...peopleHanging, { ...currentUser, openToTalk: isTalking, openToDance: isDancing }]);
    } else {
      setPeopleHanging(peopleHanging.filter((person) => person.name !== currentUser.name));
    }
  };

  // Send a dance request
  const requestDance = (person) => {
    setDanceRequests([...danceRequests, { from: currentUser.name, to: person.name }]);
  };

  // Accept a dance request
  const acceptDance = (index) => {
    alert(`🎉 You accepted a dance with ${danceRequests[index].from}!`);
    setDanceRequests(danceRequests.filter((_, i) => i !== index));
  };

  // Decline a dance request
  const declineDance = (index) => {
    setDanceRequests(danceRequests.filter((_, i) => i !== index));
  };

  return (
    <>
      <Feed_Header />
      <div className="container mt-4 text-white bg-dark p-4 rounded">
        <h2 className="fw-bold">Party Mode 🕺💃</h2>

        {/* Party Mode Toggle */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="partyMode"
            checked={isPartyMode}
            onChange={togglePartyMode}
          />
          <label className="form-check-label ms-2 fw-bold" htmlFor="partyMode">
            Activate Party Mode 🎉
          </label>
        </div>

        {/* Toggle Buttons (Only active if Party Mode is on) */}
        {isPartyMode && (
          <div className="d-flex justify-content-between my-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="danceMode"
                checked={isDancing}
                onChange={() => setIsDancing(!isDancing)}
              />
              <label className="form-check-label ms-2 fw-bold" htmlFor="danceMode">
                Open to Dance 💃
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="talkMode"
                checked={isTalking}
                onChange={() => setIsTalking(!isTalking)}
              />
              <label className="form-check-label ms-2 fw-bold" htmlFor="talkMode">
                Open to Talk 🗣️
              </label>
            </div>
          </div>
        )}

        {/* List of People Hanging */}
        <h4 className="mt-4">People Hanging Out 🎉</h4>
        <ul className="list-group mt-3">
          {peopleHanging.length > 0 ? (
            peopleHanging.map((person, index) => (
              <li
                key={index}
                className="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{person.name}</strong> ({person.gender}) - {person.location}
                  <br />
                  <span style={{ color: person.openToTalk ? "#004d00" : "#660000", fontWeight: "bold" }}>
                    {person.openToTalk ? "🗣️ Open to Talk" : "❌ Not Open to Talk"}
                  </span>{" "}
                  |{" "}
                  <span style={{ color: person.openToDance ? "#004d00" : "#660000", fontWeight: "bold" }}>
                    {person.openToDance ? "💃 Open to Dance" : "❌ Not Open to Dance"}
                  </span>
                </div>
                {/* Dance Request Button */}
                <button
                  className={`btn ${person.openToDance ? "btn-success" : "btn-danger"} fw-bold`}
                  disabled={!person.openToDance}
                  onClick={() => requestDance(person)}
                >
                  {person.openToDance ? "Request Dance 💃" : "Unavailable ❌"}
                </button>
              </li>
            ))
          ) : (
            <p>No one is hanging out right now.</p>
          )}
        </ul>

        {/* Dance Requests */}
        {danceRequests.length > 0 && (
          <div className="mt-4 p-3 bg-secondary rounded">
            <h4>💌 Dance Requests</h4>
            <ul className="list-group">
              {danceRequests.map((request, index) => (
                <li
                  key={index}
                  className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{request.from}</strong> wants to dance with you! 💃
                  </span>
                  <div>
                    <button className="btn btn-success btn-sm me-2" onClick={() => acceptDance(index)}>
                      ✅ Accept
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => declineDance(index)}>
                      ❌ Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Party;
