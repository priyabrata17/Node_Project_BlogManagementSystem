const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    const token = req?.body?.token || req?.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token found !!",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error(error?.message || "Something went wrong !!");
    return res.status(403).json({
      status: false,
      message: "Token expired or invalid token !!",
    });
  }
};

module.exports = authCheck;
