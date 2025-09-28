const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ["low", "high", "urgent"],
    default: "low"
  },
  done: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Task", TaskSchema);
