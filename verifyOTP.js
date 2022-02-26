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

  const { code, phone } = JSON.parse(event.body);
  //   const { code, phone } = event;

  if (!code || !phone) {
    callback(null, _400({ err: "Bad input" }));
  }

  const phoneNumber = String(phone).replace(/[^\d]/g, "");
  const intCode = parseInt(code);

  admin
    .auth()
    .getUser(phoneNumber)
    .then(() => {
      const ref = admin.database().ref("users/" + phoneNumber);
      ref.on("value", (snapshot) => {
        ref.off();
        const user = snapshot.val();

        if (user.code !== intCode || !user.codeValid) {
          callback(null, _400({ err: "Code is not valid!" }));
        }

        ref.update({ codeValid: false });
        admin
          .auth()
          .createCustomToken(phoneNumber)
          .then((token) => {
            callback(null, _200({ token }));
          });
      });
    });
};
