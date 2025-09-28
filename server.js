require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();

// EJS setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Home Page
app.get("/", async (req, res) => {
  const tasks = await Task.find().lean();
  res.render("list", { items: tasks });
});

// Add Task
app.post("/add", async (req, res) => {
  const { ele1, priority } = req.body;
  if (!ele1.trim()) {
    return res.send("<script>alert('Task cannot be empty!'); window.location.href='/'</script>");
  }
  await Task.create({ text: ele1, priority: priority || "low" });
  res.send("<script>alert('Task added successfully!'); window.location.href='/'</script>");
});

// Delete Task
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  await Task.findByIdAndDelete(id);
  res.send("<script>alert('Task deleted successfully!'); window.location.href='/'</script>");
});

// Toggle Complete/Incomplete
app.post("/toggle", async (req, res) => {
  const { id } = req.body;
  const task = await Task.findById(id);
  if (task) {
    task.done = !task.done;
    await task.save();
  }
  res.redirect("/");
});

// Edit Task
app.post("/edit", async (req, res) => {
  const { id, newText } = req.body;
  if (newText.trim()) {
    await Task.findByIdAndUpdate(id, { text: newText });
    return res.send("<script>alert('Task updated successfully!'); window.location.href='/'</script>");
  }
  res.redirect("/");
});

// Filter by Priority
app.get("/filter", async (req, res) => {
  const { priority } = req.query;
  let tasks = priority ? await Task.find({ priority }).lean() : await Task.find().lean();
  res.render("list", { items: tasks });
});

// Server Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
