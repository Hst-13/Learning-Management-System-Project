const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const getTasks = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "learning management system project",
      async (err, decodedToken) => {
        if (err) {
          console.log(err.messsage);
          res.locals.tasks = null;
          next();
        } else {
          let tasks = [];
          let taskArray = await Task.find().sort({ createdAt: -1 });
          taskArray.forEach((task) => {
            if (
              JSON.stringify(task.user_id) === JSON.stringify(decodedToken.id)
            ) {
              tasks.push(task);
            }
          });
          res.locals.tasks = tasks;
          next();
        }
      }
    );
  } else {
    res.locals.tasks = null;
    next();
  }
};

module.exports = { getTasks };
