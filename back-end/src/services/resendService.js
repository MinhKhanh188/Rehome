// back-end/src/services/resendService.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(to, resetLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Rehome Support <support@rehometeam.onresend.com>',
      to,
      subject: 'Đặt lại mật khẩu của bạn',
      html: `<p>Click vào liên kết sau để đặt lại mật khẩu:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

module.exports = { sendResetEmail };
