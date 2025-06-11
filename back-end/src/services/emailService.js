// back-end/src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendResetCodeEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Re-Home Support" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Mã đặt lại mật khẩu của bạn',
    html: `<p>Xin chào,</p>
           <p>Mã xác thực để đặt lại mật khẩu của bạn là: <strong>${code}</strong></p>
           <p>Mã này sẽ hết hạn sau 10 phút.</p>`,
  });
};

module.exports = sendResetCodeEmail;
