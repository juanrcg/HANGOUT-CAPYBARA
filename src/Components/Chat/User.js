import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import defaultUserPhoto from './default_image.png'; // Replace with path to a default icon

const User = ({ name, username, onClick }) => {
    const navigate = useNavigate();

    const handleViewProfile = (e) => {
        e.stopPropagation();
        navigate(`/oprofile?username=${username}`);
    };

    const handleViewInventory = (e) => {
        e.stopPropagation();
        navigate(`/oinventory?username=${username}&email=${name}`);
    };

    return (
        <button
            className="btn btn-dark d-flex justify-content-between align-items-center w-100 mb-2"
            onClick={() => onClick(username, name)}
        >
            <div className="d-flex align-items-center">
                <img 
                    src={defaultUserPhoto} 
                    alt="User" 
                    className="rounded-circle me-3" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                />
                <span>{name}</span>
            </div>
            <div>
                <button className="btn btn-light me-2" onClick={handleViewProfile}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <button className="btn btn-light" onClick={handleViewInventory}>
                    <FontAwesomeIcon icon={faBoxOpen} />
                </button>
            </div>
        </button>
    );
};

export default User;
