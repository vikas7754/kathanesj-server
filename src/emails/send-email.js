const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (
  to,
  subject,
  templateData,
  templateFile,
  attachment
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });

  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "templates", templateFile),
    "utf8"
  );
  const template = handlebars.compile(emailTemplateSource);
  const html = template(templateData);

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: to,
    subject: subject,
    html: html,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        path: attachment.path,
      },
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw err;
  }
};

module.exports = sendEmail;
