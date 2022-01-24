import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Position } from './models/positions.js';

dotenv.config();
const app = express();

const dbURI = "mongodb+srv://dejiajibola:"+ process.env.DB_PASSWORD +"@mongoatlastest.yf6cp.mongodb.net/Uniswapdb?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })  
    .then((result) => app.listen(process.env.PORT))
    .catch((err) => console.log(err));