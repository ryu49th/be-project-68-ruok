const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectdb = require('./config/db');   

dotenv.config({path:'./config/config.env'});

connectdb();

const app=express();

app.set('query parser','extended');

app.use(express.json());

app.use(cookieParser());
const workingspace = require('./routes/workingspaces');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');

app.use('/api/v1/workingspaces',workingspace);
app.use('/api/v1/reservations',reservations);
app.use('/api/v1/auth',auth);

const port=process.env.port || 5000;

const server = app.listen(port, console.log('server runing in ', process.env.node_env, 'mode on port ', port));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`error: ${err.message}`);

    server.close(() => process.exit);
})