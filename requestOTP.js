const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const { _200, _400 } = require("./response");
const twilio, { messagingServiceSid } = require("./twilio");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://one-time-password-alx.asia-southeast1.firebasedatabase.app",
});

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { phone } = JSON.parse(event.body);

  if (!phone) {
    callback(null, _400({ error: "You must provide a phone number!" }));
    // return _400({ error: "You must provide a phone number!" })
  }
  const phoneNumber = String(phone).replace(/[^\d]/g, "");

  admin
    .auth()
    .getUser(phoneNumber)
    .then((userRecord) => {
      const code = Math.floor(Math.random() * 9000 + 1000);

      twilio.messages
        .create({
          body: "Your code is: " + code,
          messagingServiceSid,
          to: phoneNumber,
        })
        .then((message) => {
          // callback(null, _200({ message }));
          admin
            .database()
            .ref("users/" + phoneNumber)
            .set({ code: code, codeValid: true })
            .then(() => {
              callback(null, _200({ success: true }));
              // return _200();
            })
            .catch((err) => {
              callback(null, _400({ err }));
              // return _400({ error: err });
            });
        })
        .catch((err) => {
          callback(null, _400({ err }));
        });
    })
    .catch((err) => {
      callback(null, _400({ err }));
      // return _400({error:err})
    });
};
