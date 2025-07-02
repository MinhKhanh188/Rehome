// back-end/src/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const CoinTransactionModel = require('../models/CoinTransaction');
const ApiError = require('../utils/ApiError');
const sendResetCodeEmail = require('../services/emailService');
const generateUniqueId = require('../utils/uniqueIdGenerator');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class userController {

    async loginWithGoogle(req, res, next) {
        try {
            const { idToken } = req.body;
            if (!idToken) throw new ApiError(400, 'Thiếu idToken.');

            // Verify token with Google
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            // Get user info
            const { email, name, picture, sub } = payload;

            // Find or create user
            let user = await UserModel.findOne({ email });
            if (!user) {
                const dummyHash = await bcrypt.hash(Math.random().toString(36), 10);

                user = await UserModel.create({
                    name,
                    email,
                    passwordHash: dummyHash,
                    loginProvider: 'google',
                    uniqueId: generateUniqueId(),
                    profilePic: picture,
                    isVerified: true,
                });

            }

            // Create JWT
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
                    profilePic: user.profilePic,
                },
                token,
            });

        } catch (err) {
            next(err);
        }
    }

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
                uniqueId: generateUniqueId(),
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

            if (user.loginProvider === 'google') {
                throw new ApiError(400, 'Tài khoản này đăng nhập bằng Google. Vui lòng sử dụng Google Login.');
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

    // ===================================================================================


    // Admin: increase user's coin balance
    async increaseCoin(req, res, next) {
        try {
            const { id } = req.params;
            const { amount } = req.body;

            if (!amount || isNaN(amount) || amount <= 0) {
                throw new ApiError(400, 'Số coin không hợp lệ.');
            }

            const user = await UserModel.findById(id);
            if (!user) throw new ApiError(404, 'Không tìm thấy người dùng.');

            user.coin += Number(amount);
            await user.save();
            await CoinTransactionModel.create({
                userId: user._id,
                type: 'topup',
                amount,
                description: 'Admin added coins'
            });

            res.status(200).json({ message: `Đã cộng ${amount} coin cho người dùng.`, coin: user.coin });
        } catch (err) {
            next(err);
        }
    }

    async getAllCoinHistory(req, res, next) {
        try {
            const history = await CoinTransactionModel.find()
                .populate('userId', 'name uniqueId') // ⬅️ only get name + uniqueId
                .sort({ createdAt: -1 });

            // Optional: Clean the response to only include relevant fields
            const filtered = history.map(tx => ({
                _id: tx._id,
                amount: tx.amount,
                createdAt: tx.createdAt,
                user: {
                    name: tx.userId?.name,
                    uniqueId: tx.userId?.uniqueId
                }
            }));

            res.status(200).json({ history: filtered });
        } catch (err) {
            next(err);
        }
    }


    // Get user's coin transaction history
    async getCoinHistory(req, res, next) {
        try {
            const { id } = req.params;
            const history = await CoinTransactionModel.find({ userId: id }).sort({ createdAt: -1 });

            res.status(200).json({ history });
        } catch (err) {
            next(err);
        }
    }



    // Admin: find user by uniqueId
    async findUserByUniqueId(req, res, next) {
        try {
            const { uniqueId } = req.params;
            const user = await UserModel.findOne({ uniqueId }).select('-passwordHash');

            if (!user) throw new ApiError(404, 'Không tìm thấy người dùng với uniqueId này.');

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    }




    // =================================================================================

    // GET /me
    async getUserProfile(req, res, next) {
        try {
            const user = await UserModel.findById(req.user._id).select('-passwordHash');
            res.status(200).json({
                status: 200,
                user
            });
        } catch (err) {
            console.log(err);
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

    // Admin: delete user
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            const user = await UserModel.findByIdAndDelete(id);
            if (!user) throw new ApiError(404, 'Không tìm thấy người dùng.');

            res.status(200).json({ message: 'Xóa người dùng thành công.' });
        } catch (err) {
            next(err);
        }
    }


}

module.exports = new userController();
