import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext'; 
import API_BASE_URL from '../config';

const TovarForm = ({ onAddTovar, isLoading }) => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на обязательные поля
    if (!title.trim() || !description.trim() || !image.trim() || !genre.trim() || !releaseDate) {
      alert('Please fill in all fields');
      return;
    }

    // Проверка рейтинга
    if (isNaN(rating) || rating < 0) {
      alert('Rating must be a positive number');
      return;
    }

    // Проверка на корректную дату
    if (isNaN(Date.parse(releaseDate))) {
      alert('Invalid release date');
      return;
    }

    // Обработка жанра: если жанр пустой, передаем пустой массив
    const newTovar = {
      title,
      description,
      image,
      genre: genre ? genre.split(',').map((g) => g.trim()) : [],
      releaseDate,
      rating: parseFloat(rating) || 0,
    };

    // Логирование данных перед отправкой
    console.log({
      title,
      description,
      image,
      genre,
      releaseDate,
      rating,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/tovars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTovar),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error adding tovar:', errorText);
        alert(`Error: ${errorText || 'Failed to add tovar'}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        onAddTovar(data.data); // Обновление списка товаров
        setTitle('');
        setDescription('');
        setImage('');
        setGenre('');
        setReleaseDate('');
        setRating('');
      } else {
        alert(data.message || 'Error adding tovar');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Add New Movie</Typography>

      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        multiline
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Image URL"
        variant="outlined"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Genre"
        variant="outlined"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Release Date"
        type="date"
        variant="outlined"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        required
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="Rating"
        type="number"
        variant="outlined"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        step="0.1"
        margin="normal"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isLoading}
        sx={{ mt: 2 }}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        {isLoading ? 'Adding...' : 'Add Movie'}
      </Button>
    </Box>
  );
};

export default TovarForm;
