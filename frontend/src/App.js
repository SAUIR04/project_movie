import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Tovars from './components/Tovars';
import Header from './components/Header';
import './style.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-container">
        <Routes>
          <Route path="/tovars" element={<Tovars />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
