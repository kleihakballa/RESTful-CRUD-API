const express = require('express');
const router = express.Router();
const Authors = require('../model/Authors');
const Books = require('../model/Books');
const Users = require('../model/user');


router.get('/', async (req, res) => {
    try {
        const bookCount = await Books.countDocuments();
        const authorCount = await Authors.countDocuments();
        const userCount = await Users.countDocuments();

        res.json({ bookCount, authorCount, userCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

module.exports = router
