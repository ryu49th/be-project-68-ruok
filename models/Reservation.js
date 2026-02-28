const mongoose = require('mongoose');

const ReservationSchema=new mongoose.Schema({
    ReserveDate: {
        type: Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    workingspaces:{
        type:mongoose.Schema.ObjectId,
        ref: 'WorkingSpace',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Reservation',ReservationSchema);