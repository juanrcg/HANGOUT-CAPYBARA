import React, { Component, useEffect, useState, useContext, useRef, useCallback, createContext } from 'react';
import Feed_Header from '../User/feed_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../../Context/AccountContext'
import Messager from './message_box';
import Footer from '../footer';
import User_bar from './users_bar';
import { useWebSocket } from '../../Context/WebSocketContext'; // Adjust path as per your WebSocket context
import User from './User';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function Chat() {

    const [connection, setConnection] = useState(false);
    const [attribute, setAttribute] = useState("");
    const [attribute_value, setAttribute_value] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedSender, setSelectedSender] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const { socket } = useWebSocket();

    let mysub = ''; 

    useEffect(() => {


        if (socket) {
            setIsConnected(socket.readyState === WebSocket.OPEN);

            const handleOpen = () => setIsConnected(true);
            const handleClose = () => setIsConnected(false);

            socket.addEventListener('open', handleOpen);
            socket.addEventListener('close', handleClose);

            return () => {
                socket.removeEventListener('open', handleOpen);
                socket.removeEventListener('close', handleClose);
            };
        }


    }, [socket]);

    const handleUserSelect = (username,name) => {

        if (selectedSender == username) {
           
        }

        else {
            

            const newTabUrl = `/message_box?selectedSender=${encodeURIComponent(name)}&selectedSenderSub=${encodeURIComponent(username)}`;
            window.open(newTabUrl, '_self');
            getSession()
                .then(session => {

                    if (socket && socket.readyState === WebSocket.OPEN) {

                      
                        setSelectedSender(username);
                      
                        console.log(username);

                    } else {
                        console.error('WebSocket connection not open.');
                    }


                })
                .catch(err => {

                    console.log(err);
                })

          
           
        }
       
     } 
    

    const { updateUser, resetpass, getSession, userPool, cognitoIdentityServiceProvider } = useContext(AccountContext);

 


    return (<>
        
          
                <Feed_Header></Feed_Header>


                <div className="chat_room">

                    <User_bar onUserSelect={handleUserSelect} />

                </div>

           

            <Footer></Footer>
    </>
    )

}
export default Chat;




