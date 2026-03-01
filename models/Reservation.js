const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    // ✅ แก้ ReserveDate → date
    date: {
        type: Date,
        required: [true, 'Please add a reservation date']
    },
    
    // ✅ Field ใหม่สำหรับเวลาเริ่ม-สิ้นสุด
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
    
    // ✅ Field ใหม่สำหรับวัตถุประสงค์
    purpose: {
        type: String,
        required: [true, 'Please add a purpose'],
        maxlength: [200, 'Purpose cannot exceed 200 characters']
    },
    
    // ✅ แก้ WorkingSpace → workingspace (ตัวเล็กทั้งหมด)
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
    // ✅ เพิ่ม timestamps สำหรับ updatedAt อัตโนมัติ
    timestamps: true
});

// ✅ Index เพื่อป้องกันการจองซ้ำ (optional แต่แนะนำ)
ReservationSchema.index({ user: 1, workingspace: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', ReservationSchema);