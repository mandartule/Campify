//here we pass a function that runs the passed function 
// and catches any errors and pases them to the next function

module.exports = func => {
  console.log("catchAsync called");
  return (req, res, next) => {
    func(req, res, next).catch(next);
    console.log("catchAsync returned");
  }
}