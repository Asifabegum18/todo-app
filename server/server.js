// server.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/todoDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// =========================
// TASK MODEL
// =========================

const TaskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Task = mongoose.model("Task", TaskSchema);


// =========================
// AUTH ROUTES
// =========================

// SIGNUP
app.post("/signup", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      message: "Signup successful"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// LOGIN
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// =========================
// TASK ROUTES
// =========================

// GET TASKS
app.get("/tasks", async (req, res) => {
  res.json(await Task.find());
});


// ADD TASK
app.post("/tasks", async (req, res) => {

  const task = new Task({
    text: req.body.text,
    completed: false
  });

  await task.save();

  res.json(task);

});


// UPDATE TASK
app.put("/tasks/:id", async (req, res) => {

  const updated =
    await Task.findByIdAndUpdate(
      req.params.id,
      {
        completed: req.body.completed
      },
      { new: true }
    );

  res.json(updated);

});


// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {

  await Task.findByIdAndDelete(
    req.params.id
  );

  res.json({
    msg: "Deleted"
  });

});


// =========================
// SERVER
// =========================

app.listen(5000, () =>
  console.log("Server running on port 5000")
);