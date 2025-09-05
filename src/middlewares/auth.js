const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Flexible authentication middleware with permission checking
const auth = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            // Get token from Authorization header
            const authHeader = req.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Authentication token is required.',
                    error: 'NO_TOKEN'
                });
            }

            const token = authHeader.split(' ')[1]; // Extract token

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Authentication token is missing.',
                    error: 'NO_TOKEN'
                });
            }

            // Verify token
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Session has expired. Please login again.',
                        error: 'TOKEN_EXPIRED'
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: 'Invalid authentication token.',
                    error: 'INVALID_TOKEN'
                });
            }

            // Find user by ID from decoded token
            let user;
            if (requiredPermissions.length > 0) {
                // If permissions are required, populate the role field
                user = await User.findById(decoded.userId || decoded.adminId)
                    .select('-password')
                    .populate('role', 'name permissions');
            } else {
                // If no permissions required, just get basic user info
                user = await User.findById(decoded.userId || decoded.adminId)
                    .select('-password');
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found or token is invalid.',
                    error: 'USER_NOT_FOUND'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated. Please contact administrator.',
                    error: 'ACCOUNT_DEACTIVATED'
                });
            }

            // If user is super admin, allow access without permission check
            if (user.isSuperAdmin) {
                req.user = user;
                req.userType = 'super_admin';
                return next();
            }

            // If no permissions required, allow access
            if (requiredPermissions.length === 0) {
                req.user = user;
                req.userType = 'user';
                return next();
            }

            // Check if user has required permissions
            if (!user.role) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. No role assigned to user.',
                    error: 'NO_ROLE'
                });
            }

            // Check if user's role has all required permissions
            const userPermissions = user.role.permissions || [];
            const hasAllPermissions = requiredPermissions.every(permission => 
                userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Insufficient permissions.',
                    error: 'INSUFFICIENT_PERMISSIONS',
                    required: requiredPermissions,
                    userPermissions: userPermissions
                });
            }

            // Attach user info to request object
            req.user = user;
            req.userType = 'user';

            next(); // proceed to the next middleware or route handler

        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during authentication.',
                error: 'SERVER_ERROR'
            });
        }
    };
};

module.exports = auth;
