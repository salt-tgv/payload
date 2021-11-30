const boardGenerator = (num, value) => {
  boardArr = Array(num).fill(0, 0, num);
  return boardArr.map(elem => {
    return Array(num).fill(value, 0, num);
  })
  
}

module.exports = boardGenerator;
