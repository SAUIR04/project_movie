import React, { useState, useContext } from 'react';
import '../style.css';
import API_BASE_URL from '../config';
import { AuthContext } from '../contexts/AuthContext';

const TovarItem = ({ tovar, onUpdateTovar, onDeleteTovar }) => {
    const { token } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: tovar.title,
        description: tovar.description,
        image: tovar.image,
        genre: tovar.genre.join(', '),
        releaseDate: tovar.releaseDate.slice(0, 10), // YYYY-MM-DD only
        rating: tovar.rating,
    });

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const updatedTovar = {
            ...tovar,
            title: editData.title,
            description: editData.description,
            image: editData.image,
            genre: editData.genre.split(',').map((g) => g.trim()),
            releaseDate: editData.releaseDate,
            rating: parseFloat(editData.rating),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/tovars/${tovar._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedTovar),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Update error:', text);
                return;
            }

            const data = await response.json();
            if (data.success) {
                onUpdateTovar(data.data);
                setIsEditing(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating tovar:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this tovar?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/tovars/${tovar._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Delete error:', text);
                return;
            }

            const data = await response.json();
            if (data.success) {
                onDeleteTovar(tovar._id);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting tovar:', error);
        }
    };

    return (
        <li className="tovar-item">
            {!isEditing ? (
                <>
                    <div className="tovar-details">
                        <h3>{tovar.title}</h3>
                        <p>{tovar.description}</p>
                        {tovar.image && (
                            <img
                                src={tovar.image}
                                alt={tovar.title}
                                className="tovar-image"
                            />
                        )}
                        <p><strong>Genres:</strong> {tovar.genre.join(', ')}</p>
                        <p><strong>Release Date:</strong> {new Date(tovar.releaseDate).toLocaleDateString()}</p>
                        <p><strong>Rating:</strong> {tovar.rating}</p>
                    </div>
                    <div className="tovar-actions">
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    </div>
                </>
            ) : (
                <div className="edit-form">
                    <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleChange}
                        placeholder="Title"
                    />
                    <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <input
                        type="text"
                        name="image"
                        value={editData.image}
                        onChange={handleChange}
                        placeholder="Image URL"
                    />
                    <input
                        type="text"
                        name="genre"
                        value={editData.genre}
                        onChange={handleChange}
                        placeholder="Genres"
                    />
                    <input
                        type="date"
                        name="releaseDate"
                        value={editData.releaseDate}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        step="0.1"
                        name="rating"
                        value={editData.rating}
                        onChange={handleChange}
                        placeholder="Rating"
                    />
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
        </li>
    );
}

export default TovarItem;
