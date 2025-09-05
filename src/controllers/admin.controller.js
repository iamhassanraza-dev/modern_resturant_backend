const AdminModel = require('../models/admin.model');
const StaffModel = require('../models/staff.model');
const CustomerModel = require('../models/customer.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//generate json web token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


// generate otp
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp
}



// register supper admin
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password, and name are required" });
        }
        const existingAdmin = await AdminModel.findOne();
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new AdminModel({ email, password: hashedPassword, name });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });

    }catch (err) {
        console.error("Error in registerAdmin:", err);
        res.status(500).json({ message: "Server error" });
    }
};




// login admin
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(admin._id);
        res.status(200).json({ token });
    } catch (err) {
        console.error("Error in loginAdmin:", err);
        res.status(500).json({ message: "Server error" });
    }
};





// get admin profile
exports.getAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const admin = await AdminModel.findById(adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ admin });
    } catch (err) {
        console.error("Error in getAdminProfile:", err);
        res.status(500).json({ message: "Server error" });
    }
};





// update admin profile
exports.updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const { name } = req.body;
        const profileImage = req.file ? req.file.path : null;
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (name) admin.name = name;
        if (profileImage) admin.profileImage = profileImage;
        await admin.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Error in updateAdminProfile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

