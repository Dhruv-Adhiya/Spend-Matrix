const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; background:#f4f4f4; padding:20px;">
  <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:8px;">
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password.</p>
    <p>Click the button below:</p>
    <a href="${resetLink}"
       style="display:inline-block; padding:10px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
       Reset Password
    </a>
    <p style="margin-top:20px;">This link expires in 15 minutes.</p>
    <p>If you didn't request this, ignore this email.</p>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Spend Matrix" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html,
  });
};

module.exports = { sendPasswordResetEmail };
