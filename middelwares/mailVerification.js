/* eslint-disable no-useless-catch */
const sgMail = require("@sendgrid/mail")
require("dotenv").config();

const sendVerification = async (data) => {
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

  const email = { ...data, from: "deleniv08@gmail.com" };
  
  try {
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error
  }
}

module.exports = sendVerification 
