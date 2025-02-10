import React, { useState, useEffect } from "react";
import Feed_Header from "./feed_header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const GOOGLE_CLIENT_ID = "183591063806-1sus04c4pkkas3v1qe67h3q5ag83mr69.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "https://hangiando.netlify.app/calendar";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar"
];

const GoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

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

  const handleGoogleOAuthSignIn = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      GOOGLE_REDIRECT_URI
    )}&response_type=token&scope=${encodeURIComponent(GOOGLE_SCOPES.join(" "))}`;

    window.location.href = authUrl;
  };
  const fetchEvents = async () => {
    if (!googleToken) return;
  
    const now = new Date().toISOString();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const timeMax = sixMonthsLater.toISOString(); // Limit to six months ahead
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&timeMax=${encodeURIComponent(timeMax)}&orderBy=startTime&singleEvents=true`,
        { headers: { Authorization: `Bearer ${googleToken}` } }
      );
  
      const data = await response.json();
      if (data.items) {
        const uniqueEvents = [];
        const eventSet = new Set();
  
        data.items.forEach(event => {
          const startDate = event.start?.dateTime || event.start?.date;
          if (!startDate || isNaN(new Date(startDate).getTime())) return;
  
          const eventDate = new Date(startDate);
          if (eventDate <= sixMonthsLater) {
            const eventKey = `${event.id}-${startDate}`;
            if (!eventSet.has(eventKey)) {
              eventSet.add(eventKey);
              uniqueEvents.push(event);
            }
          }
        });
  
        setEvents(uniqueEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  

  const checkConflicts = async (time) => {
    const selectedStartTime = new Date(time);
    const selectedEndTime = new Date(selectedStartTime.getTime() + 60 * 60 * 1000);

    return events.some(event => {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);
      return (selectedStartTime >= eventStart && selectedStartTime < eventEnd) ||
             (selectedEndTime > eventStart && selectedEndTime <= eventEnd);
    });
  };

  const createEvent = async () => {
    if (!googleToken || !recipientEmail || !selectedTime) {
      alert("Please enter a valid email and date/time.");
      return;
    }

    if (await checkConflicts(selectedTime)) {
      alert("The recipient already has an event at this time.");
      return;
    }

    const event = {
      summary: "Meeting Request",
      start: { dateTime: new Date(selectedTime).toISOString(), timeZone: "America/New_York" },
      end: {
        dateTime: new Date(new Date(selectedTime).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "America/New_York"
      },
      attendees: [{ email: recipientEmail }]
    };

    try {
      await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${googleToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(event)
      });

      alert("Appointment scheduled successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!googleToken) return;

    try {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${googleToken}` }
      });

      alert("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const editEvent = async (eventId) => {
    const newTime = prompt("Enter new date and time (YYYY-MM-DDTHH:MM):");
    if (!newTime) return;

    const updatedEvent = {
      start: { dateTime: new Date(newTime).toISOString(), timeZone: "America/New_York" },
      end: {
        dateTime: new Date(new Date(newTime).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "America/New_York"
      }
    };

    try {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${googleToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent)
      });

      alert("Event updated successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("google_access_token");
    setIsSignedIn(false);
    setEvents([]);
    setGoogleToken(null);
  };

  return (
    <>
      <Feed_Header />
      <div className="container mt-4 p-4 bg-dark text-white rounded">
        <h2>Google Calendar Integration 📅</h2>

        {!isSignedIn ? (
          <button onClick={handleGoogleOAuthSignIn} className="btn btn-success">
            Connect Google Calendar
          </button>
        ) : (
          <>
            <button onClick={handleSignOut} className="btn btn-danger">
              Sign Out
            </button>
            <button onClick={fetchEvents} className="btn btn-info mx-2">
              Fetch My Events
            </button>

            <h4 className="mt-4">Your Upcoming Events:</h4>
            <ul className="list-group mt-2">
  {events.length > 0 ? (
    events.map((event) => {
      const startDate = event.start?.dateTime || event.start?.date;
      return (
        <li key={event.id} className="list-group-item bg-secondary text-white">
          <strong>{event.summary}</strong> - {startDate ? new Date(startDate).toLocaleString() : "No valid date"}
          <span className="float-end">
            <FontAwesomeIcon icon={faEdit} className="mx-2 text-warning" onClick={() => editEvent(event.id)} />
            <FontAwesomeIcon icon={faTrash} className="text-danger" onClick={() => deleteEvent(event.id)} />
          </span>
        </li>
      );
    })
  ) : (
    <p>No upcoming events.</p>
  )}
</ul>

            <div className="mt-4">
              <h4>Schedule an Appointment</h4>
              <input type="email" className="form-control mt-2" placeholder="Recipient's email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
              <input type="datetime-local" className="form-control mt-2" onChange={(e) => setSelectedTime(e.target.value)} />
              <button onClick={createEvent} className="btn btn-success mt-2">Request Appointment</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GoogleCalendar;
