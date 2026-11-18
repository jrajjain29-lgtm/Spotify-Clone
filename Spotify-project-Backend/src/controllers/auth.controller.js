
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Cookie configuration
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
};

async function registerUser(req, res) {
    const { name, email, password, role = "user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { name },
            { email }
        ]
    });

    if (isUserAlreadyExists) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hash,
        role
    });

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);

    // Updated cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

async function loginUser(req, res) {
    const { name, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { name },
            { email }
        ]
    });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);

    // Updated cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

async function logoutUser(req, res) {
    // Updated clearCookie
    res.clearCookie('token', cookieOptions);

    res.status(200).json({
        message: 'User logged out successfully'
    });
}

module.exports = { registerUser, loginUser, logoutUser };
