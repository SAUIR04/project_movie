// filepath: /Users/sauirbayseidulla/Desktop/MERN/models/tovar.js
import mongoose from 'mongoose';

const tovarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    genre: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, default: 0 },
  });
const Tovar = mongoose.model('Tovar', tovarSchema); // Исправлено: имя модели с заглавной буквы
export default Tovar;