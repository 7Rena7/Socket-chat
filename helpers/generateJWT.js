const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(`Couldn't generate JWT`);
        } else {
          resolve(token);
        }
      }
    );
  });
};

const validateJWT = async (token) => {
  try {
    if (!token) {
      throw new Error("There is no token in the request");
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const authenticatedUser = await User.findById(uid);

    if (!authenticatedUser) {
      throw new Error("User trying to do the action doesn't exist");
    }

    if (!authenticatedUser.status) {
      throw new Error("User is not longer active");
    }

    if (!authenticatedUser) {
      throw new Error(
        "The user trying to do the action doesn't have the permissions to do it"
      );
    }

    return authenticatedUser;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJWT,
  validateJWT,
};
