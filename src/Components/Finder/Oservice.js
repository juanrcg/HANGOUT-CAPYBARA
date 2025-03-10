import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useWebSocket } from "../../Context/WebSocketContext";
import Ocalendar from "./Ocalendar";
import AccountContext from "../../Context/AccountContext";

function Oservice({ item }) {
    const { getSession,cognitoIdentityServiceProvider } = useContext(AccountContext);
    
    const urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get("email");
    const username = urlParams.get("username");
    const { socket, receivedAppointments, MyAppointments } = useWebSocket();
    const [showCalendar, setShowCalendar] = useState(false);
    let sub = '';


    const schedule = () => {



        if (socket && socket.readyState === WebSocket.OPEN) {
            let body = {
                action: "getappointments",
                userId: username,
            };
            socket.send(JSON.stringify(body));


            getSession()
            .then((session) => {
             sub = session.sub;
             const name = session.email;
             let body = {
                action: "getappointments",
                userId: sub
            };
            socket.send(JSON.stringify(body));
            })
            .catch((err) => {
              console.log(err);
            });

        }
        console.log(`Scheduling service: ${item.name} with ${email}`);
        setShowCalendar(true);
    };


   


    const setAppointment = (appointment_time)  => {

        console.log( appointment_time.date ,  appointment_time.time);

        if (socket && socket.readyState === WebSocket.OPEN) {

        getSession()
        .then((session) => {
         sub = session.sub;
         const name = session.email;
         let body = {
            action: "addappointment",
            userId: username,
            username: email,
            receiverId: sub,
            receiverName: name,
            date: appointment_time.date,
            time: appointment_time.time,
            title: item.name,
            status: 'ongoing',
        };
        socket.send(JSON.stringify(body));
        })
        .catch((err) => {
          console.log(err);
        });

        }
        console.log(appointment_time);
    }

    const getUserEmailBySub = async (sub) => {
        try {
            const params = {
                UserPoolId: "us-east-1_E4tHXcNqJ", // Replace with your actual User Pool ID
                Username: sub  // The sub is used as the username
            };
    
            // Fetch user details based on sub
            const data = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
    
            // Extract email from the user's attributes
            const emailAttribute = data.UserAttributes.find(attr => attr.Name === 'email');
            
            if (emailAttribute) {
                const email = emailAttribute.Value;
                return email;
            } else {
                console.log("Email not found for the given sub");
                return null;
            }
        } catch (error) {
            console.error('Error fetching user by sub:', error);
            return null;
        }
    };

    
   // if(String(email).length < 4){
    getUserEmailBySub(username).then(emailvalue => {
    
        email = emailvalue;
        console.log("User email:", email);  // Now email will be the actual value
    });//}


    return (
        <div className="p-3 mb-3 border rounded" style={{ backgroundColor: "#222", color: "#fff" }}>
            <h4>{item.name}</h4>
            <p className="text-muted">{item.description}</p>
            <div className="text-end">
                <button className="btn btn-outline-light" onClick={schedule}>
                    <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                    Schedule Now
                </button>
            </div>
            {showCalendar && <Ocalendar appointments={MyAppointments} receivedAppointments = {receivedAppointments}  scheduleAppointment={setAppointment}  />}
        </div>
    );
}

export default Oservice;