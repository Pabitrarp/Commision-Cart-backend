const Razorpay = require("razorpay");
require("dotenv").config(); // Load environment variables

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use correct environment variable
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use the correct secret
});

module.exports = razorpayInstance;