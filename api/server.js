import express from 'express';
const app = express();
import 'colors';
import env from 'dotenv';
import cors from 'cors';
import connectMongoDB from './config/db.js';
import user from './routes/User.js'
import errorMiddleware from './middlewares/errorMiddleware.js';
import cookie from 'cookie-parser';
import path, { resolve } from 'path';
const __dirname = resolve();


// Dot Env Initialize
env.config();
const port = process.env.PORT

// Init Body
app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use(cookie())
app.use(cors())

// Static Folder
app.use(express.static('build'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Routes
app.use('/api/user', user)

// Error Handler
app.use( errorMiddleware )

app.listen(port, () => {
    connectMongoDB();
    console.log(`Server is listenning successfully on Port : ${port}`.bgBlue.black);
})