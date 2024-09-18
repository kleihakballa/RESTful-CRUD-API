const axios = require('axios');

const searchBooks = async (query) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.items) {
            return response.data.items;
        } else {
            console.log('No items found');
            return [];  // Return an empty array if no items are found
        }
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

module.exports = { searchBooks };
