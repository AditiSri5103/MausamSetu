const twilio = require("twilio"); 
require("dotenv").config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(city) {
  client.messages.create({
    body: `Message from MAUSAMSETU - 🌧️ Rain predicted in ${city}. Alert your farmer friends!!`,
    from: process.env.TWILIO_PHONE,
    to: process.env.RECEIVER_PHONE
    
  })
  .then(message => console.log(`✅ SMS sent: ${message.sid}`))
  .catch(err => console.error("❌ Failed to send SMS:", err.message))


}

module.exports=sendSMS;