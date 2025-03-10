import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../../Context/AccountContext';
import User from './User';

function User_bar({ onUserSelect }) {
    const { cognitoIdentityServiceProvider } = useContext(AccountContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const listUsers = async () => {
        try {
            const params = {
                UserPoolId: "us-east-1_E4tHXcNqJ",
                AttributesToGet: ['email', 'sub']
            };

            const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
            setUsers(data.Users || []);
            console.log("Fetched users:", data.Users);
        } catch (error) {
            console.error('Error listing users:', error);
        }
    };

    useEffect(() => {
        listUsers();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(users);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();

        const newFilteredUsers = users
            .filter(user => {
                const email = user.Attributes?.find(attr => attr.Name === 'email')?.Value?.toLowerCase() || '';
                return email.includes(lowerQuery);
            })
            .sort((a, b) => {
                const aEmail = a.Attributes?.find(attr => attr.Name === 'email')?.Value?.toLowerCase() || '';
                const bEmail = b.Attributes?.find(attr => attr.Name === 'email')?.Value?.toLowerCase() || '';

                const aIndex = aEmail.indexOf(lowerQuery);
                const bIndex = bEmail.indexOf(lowerQuery);

                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                if (aIndex !== bIndex) return aIndex - bIndex;

                return aEmail.length - bEmail.length; // Shorter email is prioritized
            });

        setFilteredUsers(newFilteredUsers);
    }, [searchQuery, users]);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        />
                    </div>
                </div>
            </div>
            <div className="list-group">
                {filteredUsers.map((user, index) => {
                    const email = user.Attributes?.find(attr => attr.Name === 'email')?.Value || 'No email found';
                    const sub = user.Attributes?.find(attr => attr.Name === 'sub')?.Value || 'No Sub Found';

                    return (
                        <div key={index} className="list-group-item bg-dark text-light">
                            <User name={email} username={sub} onClick={() => onUserSelect(sub, email)} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default User_bar;
