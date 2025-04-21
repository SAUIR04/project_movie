import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './db/config.js';
import tovarRoutes from './routes/tovar.js';
import userRoutes from './routes/users.js';
import { authenticateToken, adminOnly } from './middleware/auth.js'; // Import middleware
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/tovars', authenticateToken, tovarRoutes); // Protect Tovar routes with authentication
app.use('/',userRoutes); // User routes (e.g., login/logout)

// Admin-only route example
app.get('/admin', authenticateToken, adminOnly, (req, res) => {
    res.json({ success: true, message: 'Welcome to the admin panel' });
});

// Catch-all route for undefined paths
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));