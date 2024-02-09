import bodyParser from 'body-parser';
import cors from 'cors'
import express from 'express';
import dotenv from "dotenv"
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import login from './middleware/login.js';
import passportSetup from './config/passportSetup.js';
import isAuthenticated from './middleware/auth.js';
dotenv.config();
mongoose.connect(process.env.MONGO_URI);
passportSetup(passport)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 20}))
app.use(session({secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true,}));
app.use(passport.session());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.route('/').get((req, res) =>{
    res.send("Welcome");
})
app.post("/login", login);
app.route('/docs').get((req, res) =>{
    // Import your mongoose model
}).post((req, res) =>{
    // Used for creating docs
    // const {id} = req.body;
    // var doc = new Model({id: id});
    // doc.save();
}).put((req, res) =>{
    // Used for updating docs
    // const {id, name} = req.body;
    // var doc = Model.findOneAndUpdate({id: id}, {$set: {name: name}}, {new: true});
});

app.listen(process.env.PORT);