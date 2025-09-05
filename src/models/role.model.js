const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    permissions: [{
        type: String,
        enum: [
            'create', 'read', 'update', 'delete', // Basic CRUD
            'order', 'manage_orders', 'view_orders', // Order management
            'manage_menu', 'manage_categories', 'manage_items', // Menu management
            'manage_staff', 'manage_customers', 'manage_admins', // User management
            'view_analytics', 'manage_settings', 'manage_inventory', // System management
            'manage_payments', 'view_reports', 'manage_tables' // Additional features
        ],
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', roleSchema);
