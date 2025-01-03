const sendEmail = require("../send-email");

const passwordResetMail = async (email, name) => {
  try {
    const subject = `Password Reset Successfully`;
    await sendEmail(email, subject, { name }, "password-reset.hbs");
  } catch (err) {
    throw err;
  }
};

module.exports = passwordResetMail;
