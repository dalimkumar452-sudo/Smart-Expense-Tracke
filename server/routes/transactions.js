const express = require('express');
const auth = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction'); // আগের ধাপে বানানো মডেল
const router = express.Router();

// Get all transactions for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add new transaction
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, type } = req.body;
        
        const newTransaction = new Transaction({
            userId: req.user.id,
            title,
            amount,
            category,
            type
        });

        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        
        // Ensure user owns transaction
        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;