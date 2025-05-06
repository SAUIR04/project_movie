import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import TovarForm from './TovarForm';
import TovarItem from './TovarItem';
import '../style.css';
import API_BASE_URL from '../config';

const Tovars = () => {
    const { isAuthenticated, token, loading } = useContext(AuthContext);
    const [tovars, setTovars] = useState([]);
    const navigate = useNavigate();

    const loadTovars = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tovars`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setTovars(data.data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error loading tovars:', error);
        }
    }, [token]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        } else {
            loadTovars();
        }
    }, [isAuthenticated, loading, loadTovars, navigate]);

    const handleAddTovar = (newTovar) => {
        setTovars([...tovars, newTovar]);
    };

    const handleUpdateTovar = (updatedTovar) => {
        setTovars(tovars.map(tovar => (tovar._id === updatedTovar._id ? updatedTovar : tovar)));
    };

    const handleDeleteTovar = (id) => {
        setTovars(tovars.filter(tovar => tovar._id !== id));
    };

    return (
        <div className="container">
    <header>
        <h1>Movies.KZ</h1>
    </header>
    <div className="welcome-message">Welcome, Admin</div>

    <TovarForm onAddTovar={handleAddTovar} />
    <ul>
        {tovars.map(tovar => (
            <TovarItem
                key={tovar._id}
                tovar={tovar}
                onUpdateTovar={handleUpdateTovar}
                onDeleteTovar={handleDeleteTovar}
            />
        ))}
    </ul>

   
</div>
    );
};

export default Tovars;
