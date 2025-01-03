const sendEmail = require("../send-email");
const signupMail = async (data) => {
  try {
    const subject = `Welcome to our platform ${data.name}`;
    await sendEmail(data.email, subject, data, "signup.hbs");
  } catch (err) {
    throw err;
  }
};

module.exports = signupMail;
