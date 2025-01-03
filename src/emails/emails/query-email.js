const sendEmail = require("../send-email");
const queryMail = async (query) => {
  try {
    const subject = `New Query from ${query.name}`;
    await sendEmail(
      process.env.TO_EMAIL,
      subject,
      query.toObject(),
      "query.hbs"
    );
  } catch (err) {
    throw err;
  }
};

module.exports = queryMail;
