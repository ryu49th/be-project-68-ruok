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
const hospital = require('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

app.use('/api/v1/hospitals',hospital);
app.use('/api/v1/appointments',appointments);
app.use('/api/v1/auth',auth);

const port=process.env.port || 5000;

const server = app.listen(port, console.log('server runing in ', process.env.node_env, 'mode on port ', port));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`error: ${err.message}`);

    server.close(() => process.exit);
})