import React, { useEffect, useState, useContext } from 'react';
import { useWebSocket } from '../../Context/WebSocketContext';
import AccountContext from '../../Context/AccountContext';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function AddProduct() {
    const { socket } = useWebSocket();
    const [isConnected, setIsConnected] = useState(false);
    const { getSession } = useContext(AccountContext); // To get the current user information
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [owner, setOwner] = useState(null); // Use state to manage the owner
    const [mediaFiles, setMediaFiles] = useState([]); // State to hold the media files to upload

    const s3Client = new S3Client({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        },
    });

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

    // Get session and set the owner state
    useEffect(() => {
        getSession()
            .then(session => {
                if (session && session.sub) {
                    setOwner(session.sub); // Update owner when session is available
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, [getSession]);

    // Handle file selection and upload to S3
    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const uploadedFiles = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    // Use the session.sub as part of the file path (key) in S3
                    if (!owner || !name) {
                        console.log("Owner or product name is missing.");
                        return;
                    }

                    const productName = name.replace(/\s+/g, '_'); // Replace spaces with underscores for a valid key
                    const fileName = `${file.name}`;
                    const params = {
                        Bucket: "hangoutdata", // Your S3 bucket name
                        Key: `Products/Photos/${owner}/${productName}/${fileName}`, // Use session.sub and product name as part of the key
                        Body: file,
                        ContentType: file.type,
                    };

                    // Upload file to S3
                    const command = new PutObjectCommand(params);
                    await s3Client.send(command);

                    const fileUrl = `https://hangoutdata.s3.us-east-1.amazonaws.com/Products/Photos/${owner}/${productName}/${fileName}`;
                    uploadedFiles.push(fileUrl);
                } catch (err) {
                    console.error("Error uploading file:", err);
                }
            }
            setMediaFiles(uploadedFiles); // Save the uploaded files URLs
        }
    };

    const handleSubmit = () => {
        if (!owner) {
            console.log("Owner is not available.");
            return;
        }

        const message = {
            action: 'addproduct',
            name,
            price,
            description,
            owner,
            mediaFiles: JSON.stringify(mediaFiles), // Add the file URLs to the message
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
            console.log('Product added:', message); // Optional log for confirmation
        }
    };

    return (
        <>
            <div className='product' style={{ padding: '20px', backgroundColor: '#1A1A1A', color: '#fff', borderRadius: '8px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add a New Product</h2>

                <input 
                    placeholder='Name' 
                    id="name" 
                    value={name} 
                    onChange={(event) => setName(event.target.value)} 
                    style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '4px', border: '1px solid #444' }} 
                />
                <br />
                <input 
                    placeholder='Price' 
                    type="number" 
                    id="price" 
                    value={price} 
                    onChange={(event) => setPrice(event.target.value)} 
                    style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '4px', border: '1px solid #444' }} 
                />
                <br />
                <input 
                    placeholder='Description' 
                    type="text" 
                    id="description" 
                    value={description} 
                    onChange={(event) => setDescription(event.target.value)} 
                    style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '4px', border: '1px solid #444' }} 
                />
                <br />

                {/* File input for uploading product media */}
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*,video/*" 
                    multiple // Allow multiple files to be selected
                    style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '4px', border: '1px solid #444' }} 
                />
                <br />

                <button 
                    id='submit_button' 
                    onClick={handleSubmit} 
                    style={{
                        padding: '12px 25px',
                        backgroundColor: '#fff',
                        color: '#1A1A1A',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease',
                    }}>
                    Add to Inventory
                </button>
            </div>
        </>
    );
}

export default AddProduct;
