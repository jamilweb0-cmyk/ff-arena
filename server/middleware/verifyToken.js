const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");

const verifyToken = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized Access",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      jwtSecret
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).send({
      message: "Invalid Token",
    });

  }

};

module.exports = verifyToken;