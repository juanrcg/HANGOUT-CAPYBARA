import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

const Ocalendar = ({ appointments = [], receivedAppointments = [], scheduleAppointment, editAppointment, deleteAppointment }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log(appointments , receivedAppointments);

  const allEvents = [...appointments, ...receivedAppointments].map((item) => ({
    id: item.id,
    title: `${item.title} with ${item.receiverName}`,
    start: moment(`${item.date} ${item.time}`, "MM/DD/YYYY hh:mm A").toDate(),
    end: moment(`${item.date} ${item.time}`, "MM/DD/YYYY hh:mm A").add(1, "hour").toDate(),
    date: item.date,
    time: item.time,
  }));

  console.log("All Events:", allEvents);



  useEffect(() => {
    if (selectedDate) {
      evaluateAvailableTimes(selectedDate);
    }
  }, [selectedDate, allEvents]);

  const evaluateAvailableTimes = (date) => {
    const occupiedTimes = new Set();
    allEvents.forEach((event) => {
      if (moment(event.start).format("MM/DD/YYYY") === moment(date).format("MM/DD/YYYY")) {
        occupiedTimes.add(event.time);
      }
    });
    
    const startTime = moment("08:00 AM", "hh:mm A");
    const endTime = moment("06:00 PM", "hh:mm A");
    let generatedTimes = [];
    
    while (startTime <= endTime) {
      generatedTimes.push(startTime.format("hh:mm A"));
      startTime.add(1, "hour");
    }
    
    const available = generatedTimes.filter(time => !occupiedTimes.has(time));
    setAvailableTimes(available);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedTime("");
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const appointment = {
        date: moment(selectedDate).format("MM/DD/YYYY"),
        time: selectedTime,
      };
      scheduleAppointment(appointment);
      setSelectedDate(null);
      setSelectedTime("");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      const editedEvent = {
        ...selectedEvent,
        date: moment(selectedEvent.start).format("MM/DD/YYYY"),
        time: moment(selectedEvent.start).format("hh:mm A"),
      };
      editAppointment(editedEvent);
      setShowModal(false);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteAppointment(selectedEvent.id);
      setShowModal(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 350, background: "#000", color: "#fff", borderRadius: "8px" }}
          defaultView="week"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>

      {selectedDate && (
        <div className="appointment-select">
          <h4>Select Time:</h4>
          <select
            className="form-select"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{ background: "#000", color: "#fff", border: "1px solid #fff" }}
          >
            <option value="">-- Select a time --</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary mt-3"
            onClick={handleSchedule}
            disabled={!selectedTime}
            style={{ background: "#fff", color: "#000", border: "1px solid #000" }}
          >
            Schedule Appointment
          </button>
        </div>
      )}

      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: "#000", color: "#fff" }}>
            <Modal.Title>Event Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#000", color: "#fff" }}>
            {selectedEvent && (
              <div>
                <p><strong>Title:</strong> {selectedEvent.title}</p>
                <p><strong>Start Time:</strong> {moment(selectedEvent.start).format("MM/DD/YYYY hh:mm A")}</p>
                <p><strong>End Time:</strong> {moment(selectedEvent.end).format("MM/DD/YYYY hh:mm A")}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#000", color: "#fff" }}>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Close
            </button>
            <button className="btn btn-warning" onClick={handleEditEvent}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDeleteEvent}>
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      )}

      <style>
        {`
          .calendar-container {
            padding: 20px;
            background: #000;
            color: #fff;
            border-radius: 8px;
            max-width: 800px;
            margin: auto;
          }
          .calendar {
            margin-top: 20px;
          }
          .appointment-select {
            margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default Ocalendar;
