import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AccountContext from '../../Context/AccountContext';
import User from '../Chat/User';
import SubMenu from './SubMenu';
import Feed_Header from '../User/feed_header';

function Looker({ onUserSelect }) {
    const { cognitoIdentityServiceProvider } = useContext(AccountContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const location = useLocation();

    const getQueryParam = (param) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(param) || '';
    };

    useEffect(() => {
        const keyword = getQueryParam('keyword');
        setSearchQuery(keyword.toLowerCase());
    }, [location.search]);

    const listUsers = async () => {
        if (!cognitoIdentityServiceProvider) {
            console.error("Cognito provider is missing.");
            return;
        }

        try {
            const params = {
                UserPoolId: "us-east-1_E4tHXcNqJ",
                AttributesToGet: ['email', 'sub']
            };

            const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
            setUsers(data.Users);
            setIsLoaded(true);
        } catch (error) {
            console.error('Error listing users:', error);
            setError('Failed to load users. Please try again later.');
        }
    };

    useEffect(() => {
        if (!isLoaded) {
            listUsers();
        }
    }, [isLoaded]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
            const email = emailAttribute ? emailAttribute.Value.toLowerCase() : '';
            return email.includes(searchQuery);
        });
    }, [searchQuery, users]);

    return (
        <>
            <Feed_Header />
            <SubMenu keyword={searchQuery} />
            
            <div className="container mt-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <ul className="list-group">
                    {filteredUsers.map((user, index) => {
                        const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
                        const subAttribute = user.Attributes.find(attr => attr.Name === 'sub');
                        const email = emailAttribute ? emailAttribute.Value : 'No email found';
                        const sub = subAttribute ? subAttribute.Value : 'No Sub Found';

                        return (
                            <li key={index} className="list-group-item bg-dark text-light">
                                <User
                                    name={email}
                                    username={sub}
                                    onClick={onUserSelect}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default Looker;
