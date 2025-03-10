import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountContext from '../../Context/AccountContext';
import Header from '../header';
import Footer from '../footer';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(""), [password, setPass] = useState("");
    const { login, getSession, handleGoogleSignIn } = useContext(AccountContext);

    // Automatically redirect if session is active
    useEffect(() => {
        getSession()
            .then(() => window.location.href = '/feed')
            .catch(err => console.log(err));
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [email, password]);

    // Handle login submission
    const handleLogin = (event) => {
        event.preventDefault();
        login(email, password)
            .then(() => navigate("/Feed"))
            .catch(err => {
                document.getElementById("password_label").innerHTML = err.toString().split(':')[1];
                console.log("fail", err.message);
            });
    };

    // Trigger login on 'Enter' key press
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            handleLogin(event);
        }
    };

    return (
        <>
            <Header />
            <div className="container vh-100 d-flex justify-content-center align-items-center text-white">
                <div className="card p-4 shadow-lg bg-dark text-white" style={{ maxWidth: '400px', width: '100%' }}>
                    <form>
                        <div className="mb-4 text-center">
                            <button className="btn btn-outline-light w-100" type="button" onClick={handleGoogleSignIn}>
                                Login With Google
                            </button>
                        </div>
                        <div className="separator text-center my-3">
                            <span className="text-muted">OR</span>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-white">Email</label>
                            <input id="email" value={email} onChange={e => setEmail(e.target.value)} 
                                placeholder="Enter your email" type="email" 
                                className="form-control bg-dark text-white border-light" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-white">Password</label>
                            <input id="password" value={password} onChange={e => setPass(e.target.value)} 
                                placeholder="Enter your password" type="password" 
                                className="form-control bg-dark text-white border-light" />
                            <span className="text-danger" id="password_label"></span>
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-light" type="button" onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default Login;