const jwt = require("jsonwebtoken");

const generateTokens = (rememberMe, user) => {
  try {
    if (!user) {
      throw new Error("User data missing while generating token");
    }
    const payload = {
      _id: user._id,
      email: user.email,
    };

    const rememberMeFlag = ["1", "on", "yes", "true"].includes(
      String(rememberMe).toLowerCase(),
    );

    const tokenMaxAge = rememberMeFlag ? "30d" : "24h";

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: tokenMaxAge },
    );

    return { accessToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = generateTokens;

// const jwt = require("jsonwebtoken");

// const generateTokens = (rememberMe, user) => {
//   try {
//     const payload = {
//       _id: user._id,
//       email: user.email,
//     };
//     const rememberMeFlag = ["1", "on", "yes", "true"].includes(
//       String(rememberMe).toLowerCase(),
//     );

//     const tokenMaxAge = rememberMeFlag ? "30d" : "24h";
//     const accessToken = jwt.sign(
//       payload,
//       process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
//       { expiresIn: tokenMaxAge },
//     );
//     return {rememberMeFlag, accessToken};
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// module.exports = generateTokens;
