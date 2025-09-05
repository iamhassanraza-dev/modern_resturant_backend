const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['waiter', 'chef', 'manager', 'cleaner', 'host', 'bartender', 'cashier', 'delivery', 'other'],
        default: 'waiter'
    },
    profileImage: {
        type: String,
        default: 'uploads/default_staff.png'
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' },
        country: { type: String, default: '' },
        landmark: { type: String, default: '' },
        note: { type: String, default: '' }
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
