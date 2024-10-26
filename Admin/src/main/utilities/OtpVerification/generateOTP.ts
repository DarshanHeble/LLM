const generateOTP = (): string => {
  // math.random gives a random number between 0 and 1, it could be 0.122..
  //   then it multiplies with 900000 then adds with 100000
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default generateOTP
