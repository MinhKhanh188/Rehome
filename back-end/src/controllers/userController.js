// back-end/src/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const ApiError = require('../utils/ApiError');
const sendResetCodeEmail = require('../services/emailService');

class userController {

    // POST /register
    async register(req, res, next) {
        try {
            const {
                name,
                email,
                password,
            } = req.body;

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new ApiError(400, 'Email này đã được sử dụng, vui lòng sử dụng email khác.');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const user = await UserModel.create({
                name,
                email,
                passwordHash,
            });

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                status: 201,
                user: {
                    name: user.name,
                    isVerified: user.isVerified,
                    isAdmin: user.isAdmin,
                },
                token
            });

        } catch (err) {
            next(err);
        }
    }

    // POST /login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ApiError(400, 'Email không chính xác.');
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                throw new ApiError(400, 'Email hoặc mật khẩu không chính xác.');
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({
                user: {
                    name: user.name,
                    isVerified: user.isVerified,
                    isAdmin: user.isAdmin,
                },
                token,
            });


        } catch (err) {
            next(err);
        }
    }

    // POST /forgot-password
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) throw new ApiError(404, 'Email không tồn tại.');

            const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

            user.resetCode = code;
            user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            // TODO: Send code via email
            await sendResetCodeEmail(user.email, code);

            res.status(200).json({ message: 'Đã gửi mã xác thực tới email của bạn.' });
        } catch (err) {
            next(err);
        }
    }

    // POST /verify-reset-code
    async verifyResetCode(req, res, next) {
        try {
            const { email, code } = req.body;
            const user = await UserModel.findOne({ email });

            if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
                throw new ApiError(400, 'Mã không hợp lệ hoặc đã hết hạn.');
            }

            res.status(200).json({ message: 'Mã xác thực hợp lệ.' });
        } catch (err) {
            next(err);
        }
    }


    // POST /reset-password
    async resetPassword(req, res, next) {
        try {
            const { email, code, newPassword } = req.body;
            const user = await UserModel.findOne({ email });

            if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
                throw new ApiError(400, 'Mã không hợp lệ hoặc đã hết hạn.');
            }

            user.passwordHash = await bcrypt.hash(newPassword, 10);
            user.resetCode = undefined;
            user.resetCodeExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        } catch (err) {
            next(err);
        }
    }




    // GET /me
    async getUserProfile(req, res, next) {
        try {
            const user = await UserModel.findById(req.user.id).select('-passwordHash');
            res.status(200).json({
                status: 200,
                user
            });
        } catch (err) {
            next(err);
        }
    }

    // GET /admin/users
    async getAllUsers(req, res, next) {
        try {
            // Chỉ lấy user không phải admin
            const users = await UserModel.find({ isAdmin: { $ne: true } }).select('-passwordHash');
            res.status(200).json({
                status: 200,
                users
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new userController();
