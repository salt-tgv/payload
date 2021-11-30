const boardGenerator = (num, value) => {
  return boardArr = Array(num)
    .fill(
      Array(num).fill(value, 0, num)
      , 0, num);
}

module.exports = boardGenerator;
