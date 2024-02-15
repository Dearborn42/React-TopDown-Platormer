import bodyParser from 'body-parser';
import cors from 'cors'
import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import leaderboard_route from "./routes/leaderboard-route.js"
dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 20}))
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use("/leaderboard", leaderboard_route);

app.route('/').get((req, res) =>{
    res.send("Welcome");
})


app.listen(process.env.PORT);