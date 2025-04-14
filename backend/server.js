import express from 'express';
import helmet, { contentSecurityPolicy } from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/config.js';
import tovarRoutes from './routes/tovar.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
dotenv.config();

const app = express();


app.use(cors());


app.use(helmet({
    contentSecurityPolicy: {
        directives:{
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://code.jquery.com"],
            styleSrc:["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            fontSrc:["'self'", "data:"],
            connectSrc:["'self'"]
        }
    }
}));
app.use(express.json());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 1000, // Увеличьте лимит для тестирования
});

const autiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
});

const strictlimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 500, // Limit each IP to 5 requests per windowMs
});
app.use(globalLimiter);

app.use('/tovars', strictlimiter, tovarRoutes);
app.use('/', userRoutes);

import path from 'path';
import { fileURLToPath } from 'url';

//get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));

//404 handing middleware

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});




// Connect to MongoDB
connectDB();

app.listen(3000, () => console.log('Server is running on port 3000'));