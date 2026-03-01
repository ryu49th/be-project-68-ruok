const mongoose = require('mongoose');

const WorkingSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']    
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    tel: {
        type: String,
        unique: true
    },
    openTime: {
        type: String,
        required: [true, 'Please add an opening time'],
        // Regex validates 24-hour format (e.g., 08:00, 14:30)
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time in HH:mm format (e.g., 08:00)']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add a closing time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time in HH:mm format (e.g., 22:00)']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

WorkingSpaceSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'workingspace',
    justOne: false
});

module.exports = mongoose.model('WorkingSpace', WorkingSpaceSchema);