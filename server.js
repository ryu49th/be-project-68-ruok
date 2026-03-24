const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectdb = require('./config/db');   
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
dotenv.config({path:'./config/config.env'});

connectdb();

const app=express();

app.set('query parser','extended');

app.use(express.json());

app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());
//helmet
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter=rateLimit({
    windowMs:10*60*1000,//10 mins
    max: 150000
});
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:3000']
    : true;
app.use(cors({ origin: allowedOrigins, credentials: true }));

const workingspace = require('./routes/workingspaces');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');

app.use('/api/v1/workingspaces',workingspace);
app.use('/api/v1/reservations',reservations);
app.use('/api/v1/auth',auth);

const port=process.env.PORT || 5000;

const server = app.listen(port, console.log('server runing in ', process.env.node_env, 'mode on port ', port));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`error: ${err.message}`);

    server.close(() => process.exit);
})