import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useWebSocket } from "../../Context/WebSocketContext";
import Calendar from "../Finder/Ocalendar";
import AccountContext from "../../Context/AccountContext";

function Event({ event }) {
    const { getSession } = useContext(AccountContext);
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const username = urlParams.get("username");
    const { socket, receivedEvents } = useWebSocket();
    const [events, setEvents] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    let sub = '';

    useEffect(() => {
        if (receivedEvents) {
            setEvents(receivedEvents);
        }
    }, [receivedEvents]);

    const scheduleEvent = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            let body = {
                action: "getEvents",
                userId: username,
            };
            socket.send(JSON.stringify(body));
        }
        console.log(`Scheduling event: ${event.title} with ${email}`);
        setShowCalendar(true);
    };

    const setEvent = (event_time) => {
        console.log(event_time.date, event_time.time);

        if (socket && socket.readyState === WebSocket.OPEN) {
            getSession()
                .then((session) => {
                    sub = session.sub;
                    const name = session.email;
                    let body = {
                        action: "addEvent",
                        userId: username,
                        username: email,
                        receiverId: sub,
                        receiverName: name,
                        date: event_time.date,
                        time: event_time.time,
                        title: event.title,
                        status: 'scheduled',
                    };
                    socket.send(JSON.stringify(body));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        console.log(event_time);
    };

    return (
        <div className="p-3 mb-3 border rounded" style={{ backgroundColor: "#333", color: "#fff" }}>
            <h4>{event.title}</h4>
            <p className="text-muted">{event.description}</p>
            <div className="text-end">
                <button className="btn btn-outline-light" onClick={scheduleEvent}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    Schedule Event
                </button>
            </div>
            {showCalendar && <Calendar events={events} scheduleEvent={setEvent} />}
        </div>
    );
}

export default Event;
