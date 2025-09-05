const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
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
    profileImage: {
        type: String,
        default: 'uploads/default_profile.png'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
        landmark: { type: String, required: true },
        note: { type: String, required: false }
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    // favoriteDishes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Dish'
    // }]
}, { timestamps: true });


module.exports = mongoose.model('Customer', customerSchema);