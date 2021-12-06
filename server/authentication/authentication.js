const bcrypt = require('bcrypt');

const generateHash = async (plainTxtPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainTxtPassword, salt);
  return hash;
}

const compareHash = async (plainTxtPassword, hash) => {
  const access = await bcrypt.compare(plainTxtPassword, hash);
  return access;
}

module.exports = {
  generateHash,
  compareHash
}