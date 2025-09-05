const UserModel = require('../models/user.model');
const OtpModel = require('../models/otp.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { isValidEmail } = require('../utils/validiate.email');
const { isStrongPassword } = require('../utils/validiate.password');
const { generateOTP } = require('../utils/otp.generator')
const transporter = require('../utils/nodemailer');
const dotenv = require('dotenv');
dotenv.config();




// =========================== role management ===========================

// Create Role
exports.createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Name and permissions array are required."
            });
        }

        // Check if role already exists
        const existingRole = await RoleModel.findOne({ name: name.trim() });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Role with this name already exists."
            });
        }

        const role = new RoleModel({ name: name.trim(), permissions });
        await role.save();

        return res.status(201).json({
            success: true,
            message: "Role created successfully.",
            role
        });
    } catch (error) {
        console.error("Error in createRole:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

// Get all Roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            roles
        });
    } catch (error) {
        console.error("Error in getRoles:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

// Get Role by ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await RoleModel.findById(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found."
            });
        }
        return res.status(200).json({
            success: true,
            role
        });
    } catch (error) {
        console.error("Error in getRoleById:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


// Update Role partially
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, addPermissions, removePermissions } = req.body;

        const role = await RoleModel.findById(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found."
            });
        }

        // Update role name
        if (name) role.name = name.trim();

        // Add new permissions
        if (Array.isArray(addPermissions) && addPermissions.length > 0) {
            addPermissions.forEach(perm => {
                if (!role.permissions.includes(perm)) {
                    role.permissions.push(perm);
                }
            });
        }

        // Remove permissions
        if (Array.isArray(removePermissions) && removePermissions.length > 0) {
            role.permissions = role.permissions.filter(
                perm => !removePermissions.includes(perm)
            );
        }

        role.updatedAt = Date.now();
        await role.save();

        return res.status(200).json({
            success: true,
            message: "Role updated successfully.",
            role
        });

    } catch (error) {
        console.error("Error in updateRole:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


// Delete Role
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await RoleModel.findById(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found."
            });
        }

        await RoleModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully."
        });
    } catch (error) {
        console.error("Error in deleteRole:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};







// =========================== user role management ===========================


// Assign or change role of a user
exports.assignOrChangeRole = async (req, res) => {
    try {
        const { userID, roleID } = req.body;

        if (!userID || !roleID) {
            return res.status(400).json({
                success: false,
                message: "User ID and Role ID are required."
            });
        }

        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const role = await RoleModel.findById(roleID);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found."
            });
        }

        user.role = role._id;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Role assigned/updated successfully.",
            user
        });

    } catch (error) {
        console.error("Error in assignOrChangeRole:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

// Remove role from a user
exports.removeRole = async (req, res) => {
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        user.role = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Role removed from user successfully.",
            user
        });

    } catch (error) {
        console.error("Error in removeRole:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

// Get a user's role
exports.getUserRole = async (req, res) => {
    try {
        const { userID } = req.params;

        const user = await UserModel.findById(userID).populate('role', 'name permissions');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            role: user.role
        });

    } catch (error) {
        console.error("Error in getUserRole:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};