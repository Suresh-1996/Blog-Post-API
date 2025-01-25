const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id, // User ID
    name: user.name, // User Name
    isAdmin: user.isAdmin, // Admin status
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expiration time (adjust as needed)
  });

  return token;
};

const userGenerateToken = (user) => {
  const payload = {
    id: user._id, // User ID
    name: user.name, // User Name
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expiration time (adjust as needed)
  });

  return token;
};

module.exports = { generateToken, userGenerateToken };
