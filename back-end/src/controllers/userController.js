// back-end/src/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const ApiError = require('../utils/ApiError');

class userController {

    // POST /register
    async register(req, res, next) {
        try {
            const {
                name,
                email,
                password,
                phoneNumber,
                profilePic,
                facebookUrl,
                location
            } = req.body;

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new ApiError(400, 'Email is already in use.');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const user = await UserModel.create({
                name,
                email,
                passwordHash,
                phoneNumber,
                profilePic,
                facebookUrl,
                location
            });

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                status: 201,
                token
            });

        } catch (err) {
            next(err);
            console.log(err);
        }
    }

    // POST /login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ApiError(400, 'Invalid email or password.');
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                throw new ApiError(400, 'Invalid email or password.');
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                token
            });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new userController();
