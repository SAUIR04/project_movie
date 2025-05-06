import React, { useState, useContext } from 'react';
import '../style.css';
import API_BASE_URL from '../config';
import { AuthContext } from '../contexts/AuthContext'; // ✅ Импорт AuthContext

const TovarForm = ({ onAddTovar }) => {
    const { token } = useContext(AuthContext); // ✅ Токенді алу
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !image.trim() || !genre.trim() || !releaseDate) {
            alert('Please fill in all fields');
            return;
        }

        const newTovar = {
            title,
            description,
            image,
            genre: genre.split(',').map((g) => g.trim()),
            releaseDate,
            rating: parseFloat(rating) || 0,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/tovars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // ✅ Қосылды
                },
                body: JSON.stringify(newTovar),
            });

            if (!response.ok) {
                const errorText = await response.text(); // ✅ JSON болмаса да шығару
                console.error('Error adding tovar:', errorText);
                alert(`Error: ${errorText}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                onAddTovar(data.data);
                setTitle('');
                setDescription('');
                setImage('');
                setGenre('');
                setReleaseDate('');
                setRating('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('Unexpected error. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tovar-form">
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="image">Image URL:</label>
                <input
                    type="text"
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="genre">Genre (comma-separated):</label>
                <input
                    type="text"
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="releaseDate">Release Date:</label>
                <input
                    type="date"
                    id="releaseDate"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="rating">Rating:</label>
                <input
                    type="number"
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    step="0.1"
                />
            </div>
            <button type="submit" className="btn">Add Movie</button>
        </form>
    );
};

export default TovarForm;
