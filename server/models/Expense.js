const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  type: { type: String, default: 'Expense' }, // 'Income' or 'Expense'
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Other' },
  date: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false }
});

module.exports = mongoose.model('Expense', expenseSchema);