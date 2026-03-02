const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({

    date: {
    type: Date,
    required: [true, 'Please add a reservation date'],
    // ✅ เพิ่ม custom validator
    validate: {
        validator: function(value) {
            // ตรวจสอบว่าเป็นวันที่สมเหตุสมผล (หลังปี 2020)
            return value && value.getFullYear() >= 2020;
        },
        message: 'Please provide a valid date (year must be 2020 or later)'
        }
    },
    
    startTime: {
        type: String,
        required: [true, 'Please add a start time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:mm format']
    },
    
    endTime: {
        type: String,
        required: [true, 'Please add an end time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:mm format']
    },

    purpose: {
        type: String,
        required: [true, 'Please add a purpose'],
        maxlength: [200, 'Purpose cannot exceed 200 characters']
    },
  
    workingspace: {
        type: mongoose.Schema.ObjectId,
        ref: 'WorkingSpace',
        required: [true, 'Please add a working space']
    },
    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add a user']
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {

    timestamps: true
});

ReservationSchema.index({ user: 1, workingspace: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', ReservationSchema);