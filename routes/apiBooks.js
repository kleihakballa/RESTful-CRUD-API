const express = require('express');
const router = express.Router();
const { searchBooks } = require('../externalApi/googleCloudApi');

router.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Please provide a search query' });
    }

    try {
        const books = await searchBooks(query);
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

module.exports = router;
