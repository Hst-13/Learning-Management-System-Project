const Task = require("../models/Task");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    title: "",
  };

  if (err.message === "Title is required.") {
    errors.title = "Title is required.";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const task_post = async (req, res) => {
  let { user_id, title, description, deadline } = req.body;

  try {
    let task = await Task({
      user_id,
      title,
      description,
      completed: false,
      deadline,
    });

    await task.save().then((result) => {
      res.status(201).json({ task });
    });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

const task_delete = (req, res) => {
  const id = req.params.id;

  Task.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/dashboard" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const task_update = (req, res) => {
  const id = req.params.id;

  Task.findByIdAndUpdate(id, { completed: true })
    .then((result) => {
      res.json({ redirect: "/dashboard" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { task_post, task_delete, task_update };
