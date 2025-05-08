import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';

import { AuthContext } from '../contexts/AuthContext';
import TovarForm from './TovarForm';
import TovarItem from './TovarItem';
import API_BASE_URL from '../config';

const Tovars = () => {
  const { isAuthenticated, token, loading, logout } = useContext(AuthContext);
  const [tovars, setTovars] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load Tovars
  const loadTovars = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tovars`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to load tovars');
      }

      const data = await response.json();
      if (data.success) {
        setTovars(data.data);
      } else {
        setMessage(data.message || 'Error loading tovars');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message || 'Error loading tovars');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        loadTovars();
      }
    }
  }, [isAuthenticated, loading, loadTovars, navigate]);

  // Add Tovar
  const handleAddTovar = async (title, description, image, genre, releaseDate, rating) => {
    setIsLoading(true);
    try {
      const newTovar = {
        title,
        description,
        image,
        genre: genre.split(',').map((g) => g.trim()),
        releaseDate,
        rating: parseFloat(rating) || 0,
      };

      const response = await fetch(`${API_BASE_URL}/tovars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTovar),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add tovar');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTovars((prevTovars) => [...prevTovars, data.data]);
        setMessage('Tovar added successfully');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Error adding tovar');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message || 'Error adding tovar');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Update Tovar
  const handleUpdateTovar = async (id, title, description, image, genre, releaseDate, rating) => {
    setIsLoading(true);
    try {
      const updatedTovar = {
        title,
        description,
        image,
        genre: genre.split(',').map((g) => g.trim()),
        releaseDate,
        rating: parseFloat(rating),
      };

      const response = await fetch(`${API_BASE_URL}/tovars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTovar),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update tovar');
      }

      const data = await response.json();
      if (data.success) {
        setTovars((prevTovars) =>
          prevTovars.map((tovar) =>
            tovar._id === id ? { ...tovar, ...updatedTovar } : tovar
          )
        );
        setMessage('Tovar updated successfully');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Error updating tovar');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message || 'Error updating tovar');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Tovar
  const handleDeleteTovar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tovar?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tovars/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete tovar');
      }

      const data = await response.json();
      if (data.success) {
        setTovars((prevTovars) => prevTovars.filter((tovar) => tovar._id !== id));
        setMessage('Tovar deleted successfully');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Error deleting tovar');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message || 'Error deleting tovar');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movie Management
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4 }}>
        <Card elevation={6}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Welcome, {localStorage.getItem('username')}
            </Typography>

            {message && (
              <Alert
                severity={messageType === 'error' ? 'error' : 'success'}
                sx={{ mb: 2 }}
              >
                {message}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TovarForm onAddTovar={handleAddTovar} isLoading={isLoading} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Tovars
                </Typography>

                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : tovars.length === 0 ? (
                  <Typography variant="body1" align="center">
                    No tovars found
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tovars.map((tovar) => (
                      <TovarItem
                        key={tovar._id}
                        tovar={tovar}
                        onUpdateTovar={handleUpdateTovar}
                        onDeleteTovar={handleDeleteTovar}
                        isLoading={isLoading}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Tovars;
