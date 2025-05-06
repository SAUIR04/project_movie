import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
// Corrected CSS import

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false); // Loading indicator
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Enable loading indicator

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setMessageType('success');
                navigate('/login'); // Redirect to the login page
            } else {
                setMessage(data.message);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Registration failed. Please try again.');
            setMessageType('error');
        } finally {
            setLoading(false); // Disable loading indicator
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            {/* Link to Login Page */}
            <div className="login-link">
                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    );
};

export default Register;
