import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import API_BASE_URL from '../config';

const TovarItem = ({ tovar, onUpdateTovar, onDeleteTovar, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: tovar.title,
    description: tovar.description,
    image: tovar.image,
    genre: tovar.genre.join(', '),
    releaseDate: tovar.releaseDate.slice(0, 10),
    rating: tovar.rating,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
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
        },
        body: JSON.stringify(updatedTovar),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating tovar:', errorText);
        alert(`Error: ${errorText || 'Failed to update tovar'}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        onUpdateTovar(data.data); // Обновляем данные родительского компонента
        setIsEditing(false);
      } else {
        alert(data.message || 'Error updating tovar');
      }
    } catch (error) {
      console.error('Error updating tovar:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tovar?')) return;
    onDeleteTovar(tovar._id);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      {!isEditing ? (
        <>
          {tovar.image && (
            <CardMedia
              component="img"
              height="140"
              image={tovar.image}
              alt={tovar.title}
            />
          )}
          <CardContent>
            <Typography variant="h5">{tovar.title}</Typography>
            <Typography variant="body2">{tovar.description}</Typography>
            <Typography variant="body2">
              <strong>Genres:</strong> {tovar.genre.join(', ')}
            </Typography>
            <Typography variant="body2">
              <strong>Release Date:</strong> {new Date(tovar.releaseDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              <strong>Rating:</strong> {tovar.rating}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => setIsEditing(true)} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
              <Delete />
            </IconButton>
          </CardActions>
        </>
      ) : (
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={editData.title}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={editData.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={editData.image}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Genres"
              name="genre"
              value={editData.genre}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={editData.releaseDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              value={editData.rating}
              onChange={handleChange}
              variant="outlined"
              inputProps={{ step: 0.1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleSave} color="primary" variant="contained" startIcon={<Save />}>
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} color="secondary" variant="outlined" startIcon={<Cancel />}>
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default TovarItem;
