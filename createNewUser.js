const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const { _200, _400 } = require("./response");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://one-time-password-alx.asia-southeast1.firebasedatabase.app",
});

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { phone } = JSON.parse(event.body);
 
  if (!phone) {
    callback(null, _400({ error: "Bad input" }));
  }
  const phoneNumber = String(phone).replace(/[^\d]/g, "");

  //a new user account with phone number
  admin
    .auth()
    .createUser({ uid: phoneNumber })
    .then((user) => {
      callback(null, _200({ user }));
    })
    .catch((err) => {
      callback(null, _400({ err }));
    });
};
