import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Feed_Header from "./feed_header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

const GOOGLE_CLIENT_ID = "183591063806-1sus04c4pkkas3v1qe67h3q5ag83mr69.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "https://hangiando.netlify.app/calendar";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar"
];

const localizer = momentLocalizer(moment);

const GoogleCalendar = ({ appointments }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    if (token) {
      setGoogleToken(token);
      setIsSignedIn(true);
      fetchEvents();
    }

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const googleAccessToken = params.get("access_token");

    if (googleAccessToken) {
      localStorage.setItem("google_access_token", googleAccessToken);
      setGoogleToken(googleAccessToken);
      setIsSignedIn(true);
      fetchEvents();
    }
  }, []);

  useEffect(() => {
    console.log("Appointments received:", appointments);
  }, [appointments]);

  const handleGoogleOAuthSignIn = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      GOOGLE_REDIRECT_URI
    )}&response_type=token&scope=${encodeURIComponent(GOOGLE_SCOPES.join(" "))}`;
    window.location.href = authUrl;
  };

  const fetchEvents = async () => {
    if (!googleToken) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        { headers: { Authorization: `Bearer ${googleToken}` } }
      );
      const data = await response.json();
      if (data.items) {
        const formattedEvents = data.items.map(event => ({
          id: event.id,
          title: event.summary,
          description: event.description || "No description",
          start: new Date(event.start?.dateTime || event.start?.date),
          end: new Date(event.end?.dateTime || event.start?.date),
          allDay: !event.start?.dateTime
        }));
        setGoogleEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("google_access_token");
    setIsSignedIn(false);
    setGoogleEvents([]);
    setGoogleToken(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !googleToken) return;

    try {
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${googleToken}` },
        }
      );
      setGoogleEvents(googleEvents.filter(ev => ev.id !== selectedEvent.id));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Merge Google Calendar events with receivedAppointments
  const allEvents = [...googleEvents, ...(appointments || [])];

  return (
    <>
      <Feed_Header />
      <div className="container mt-4 p-4 calendar-container">
        <h2>Google Calendar 📅</h2>
        {!isSignedIn ? (
          <button onClick={handleGoogleOAuthSignIn} className="btn btn-light">
            Connect Google Calendar
          </button>
        ) : (
          <>
            <button onClick={handleSignOut} className="btn btn-danger">
              Sign Out
            </button>
            <button onClick={fetchEvents} className="btn btn-info mx-2">
              Refresh Events
            </button>

            <div className="mt-4" style={{ height: 500 }}>
              <Calendar
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                defaultView="week"
                onSelectEvent={handleSelectEvent}
              />
            </div>
          </>
        )}

        {/* Event Details Modal */}
        {showModal && selectedEvent && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h3>{selectedEvent.title}</h3>
              <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
              <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>

              <div className="modal-actions">
                <button className="btn-black" onClick={() => alert("Edit feature coming soon!")}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button className="btn-black" onClick={handleDeleteEvent}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoogleCalendar;
