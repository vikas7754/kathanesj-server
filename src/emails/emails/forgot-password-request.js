const sendEmail = require("../send-email");

const forgotPasswordRequestMail = async (email, name, otp) => {
  try {
    const subject = `Forgot Password Request`;
    await sendEmail(
      email,
      subject,
      { name, otp },
      "forgot-password-request.hbs"
    );
  } catch (err) {
    throw err;
  }
};

module.exports = forgotPasswordRequestMail;
