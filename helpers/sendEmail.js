const sgMail = require("@sendgrid/mail");

const MY_EMAIL = process.env.MY_EMAIL;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: MY_EMAIL };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;
