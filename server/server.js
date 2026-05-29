const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 
const Expense = require('./models/Expense');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017/ExpenseTracker";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ Database connection error:", err));

// Register API
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Registration Failed!" });
  }
});

// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }
    res.status(200).json({ message: "Login Successful!", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server Error!" });
  }
});

// Add Transaction (Income/Expense) API
app.post('/add-expense', async (req, res) => {
  try {
    const { userName, type, title, amount, category, date, isRecurring } = req.body;
    const newExpense = new Expense({ userName, type, title, amount, category, date, isRecurring });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// Get Transactions API
app.get('/get-expenses/:userName', async (req, res) => {
  try {
    const expenses = await Expense.find({ userName: req.params.userName }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));