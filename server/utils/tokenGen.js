const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, userName: user.userName },
    process.env.JWT_S,
    { expiresIn: '20000h' }
  );
}

module.exports = { generateToken };