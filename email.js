const nodeMailer = require("nodemailer");

const sendCopacoStatusEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
      user: "pythonmail56@gmail.com",
      pass: "WhilePython56",
    },
  });

  console.log(options.message);

  const mailOptions = {
    from: "Copaco System <pythonmail56@gmail.com>",
    to: options.emails,
    subject: "Copaco Status Update",
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendCopacoStatusEmail;
