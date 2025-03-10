import React, { createContext, useContext, useState, useEffect } from 'react';
import AccountContext from './AccountContext';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ url, children }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [ReceivedMessages, setReceivedMessages] = useState([]);
    const [receivedPosts, setReceivedPosts] = useState([]);
    const [receivedPosts_su, setReceivedPosts_su] = useState([]);
    const [receivedProducts, setReceivedProducts] = useState([]);
    const [receivedProducts_s, setReceivedProducts_s] = useState([]);
    const [receivedServices, setReceivedServices] = useState([]);
    const[receivedEvents, setReceivedEvents] = useState([]);
    const [receivedRecomendations, setReceivedRecomendations] = useState([]);
    const [receivedAppointments, setReceivedAppoitnments] = useState([]);
    const [MyAppointments, setMyAppointments] = useState([]);
    const { getSession } = useContext(AccountContext);

    // Safely parse JSON strings
    const safelyParseJSON = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    };

    useEffect(() => {
        let subu = '';
        const initializeWebSocket = async () => {
            try {
                const session = await getSession();
                subu = session.sub;

                const socket = new WebSocket(url);

                socket.onopen = () => {
                    console.log('WebSocket connected');
                    setWebSocket(socket);
                };

                socket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                   console.log('WebSocket message:', message);

                    // Handle messages array
                    if (message.messages && Array.isArray(message.messages)) {
                        setReceivedMessages([]);
                        setReceivedMessages((prevMessages) => {
                            const updatedMessages = [
                                ...prevMessages,
                                ...message.messages.map((msg) => ({
                                    id: msg.ID, // Assuming `ID` is the unique identifier
                                    text: msg.Message,
                                    isSent: msg.Sender === subu,
                                })),
                            ];

                            // Sort messages by ID
                            return updatedMessages.sort((a, b) => a.id - b.id);
                        });
                    }

                    // Handle posts array
                    if (message.posts && Array.isArray(message.posts)) {
                        setReceivedPosts((prevPosts) => {
                            const updatedPosts = [
                                ...prevPosts,
                                ...message.posts.map((post) => ({
                                    id: post.id,
                                    content: post.content,
                                    fontFamily: post.fontFamily,
                                    fontStyle: safelyParseJSON(post.fontStyle),
                                    fontColor: post.fontColor,
                                    selectedProduct: post.selectedProduct,
                                    author: post.author,
                                    ownername: post.ownername,
                                    files: safelyParseJSON(post.files),
                                    likes: safelyParseJSON(post.likes),
                                    comments: safelyParseJSON(post.comments),
                                })),
                            ];
                            return updatedPosts.sort((a, b) => b.id - a.id);;
                        });
                    }

                    // Handle posts array
                    if (message.posts_su && Array.isArray(message.posts_su)) {
                        setReceivedPosts_su((prevPosts_su) => {
                            const updatedPosts_su = [
                                ...prevPosts_su,
                                ...message.posts_su.map((post) => ({
                                    id: post.id,
                                    content: post.content,
                                    fontFamily: post.fontFamily,
                                    fontStyle: safelyParseJSON(post.fontStyle),
                                    fontColor: post.fontColor,
                                    selectedProduct: post.selectedProduct,
                                    author: post.author,
                                    ownername: post.ownername,
                                    files: safelyParseJSON(post.files),
                                    likes: safelyParseJSON(post.likes),
                                    comments: safelyParseJSON(post.comments),
                                })),
                            ];
                            return updatedPosts_su.sort((a, b) => b.id - a.id);;
                        });
                    }


                   // Handle received products
                if (message.products && Array.isArray(message.products)) {
       // console.log('Received products:', message.products); // Log the products to inspect their structure

        setReceivedProducts((prevProducts) => {
            const updatedProducts = [
                ...prevProducts,
                ...message.products.map((product) => ({
                    type: "product", 
                    id: product.id, // Assuming `id` is the unique identifier
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    owner: product.owner,
                })),
            ];

            return updatedProducts;
        });
                 }

                     // Handle received products
                if (message.products_s) {
                    // console.log('Received products:', message.products); // Log the products to inspect their structure
             
                     setReceivedProducts_s(message.products_s);
                              }
             

                 //handle received services
                 if (message.services && Array.isArray(message.services)) {
                    // console.log('Received products:', message.products); // Log the products to inspect their structure
             
                     setReceivedServices((prevServices) => {
                         const updatedServices = [
                             ...prevServices,
                             ...message.services.map((service) => ({
                                 type: "services", 
                                 id: service.id, // Assuming `id` is the unique identifier
                                 name: service.name,
                                 price: service.price,
                                 description: service.description,
                                 owner: service.owner,
                             })),
                         ];
             
                         return updatedServices;
                     });
                              }

                 // Handle received product recommendations from IA
                 if (message.products_recommendation ) {
               
                setReceivedRecomendations(message.products_recommendation);
                }

                if (message.appointments){

                    const newMyAppointments = message.appointments
    ? message.appointments.filter(appointment => appointment.userId == subu)
    : [];

const newOtherAppointments = message.appointments
    ? message.appointments.filter(appointment => appointment.userId != subu)
    : [];

// Function to merge and remove duplicates based on appointment ID
const mergeAppointments = (existing, incoming) => {
    const allAppointments = [...existing, ...incoming];
    const uniqueAppointments = Array.from(
        new Map(allAppointments.map(app => [app.id, app])).values()
    );
    return uniqueAppointments;
};

// Update state while ensuring uniqueness
setMyAppointments(prev => mergeAppointments(prev, newMyAppointments));
setReceivedAppoitnments(prev => mergeAppointments(prev, newOtherAppointments));
}

                if (message.events){

                    console.log("flag");
                    setReceivedEvents(message.events);
                }
    
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                socket.onclose = () => {
                    console.log('WebSocket disconnected');
                    setWebSocket(null);
                };
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
            }
        };

        initializeWebSocket();

        // Cleanup function to close WebSocket connection
        return () => {
            if (webSocket) {
                webSocket.close();
                console.log('WebSocket connection closed');
            }
        };
    }, [url, getSession]);

    const contextValue = {
        socket: webSocket,
        ReceivedMessages,
        setReceivedMessages,
        receivedPosts,
        receivedPosts_su,
        receivedProducts,
        receivedProducts_s,
        receivedServices,
        receivedEvents,
        receivedRecomendations,
        receivedAppointments,
        MyAppointments,
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
