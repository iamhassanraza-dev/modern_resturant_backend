const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    profileImage: {
        type: String,
        default: 'uploads/default_admin.png'
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
