const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      uppercase: true,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
