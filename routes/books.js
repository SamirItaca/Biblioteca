const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
    const query = req.query.q;

    const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    const books = response.data.items.map(item => ({
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        pages: item.volumeInfo.pageCount || 0,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail
    }));

    res.json(books);
});

module.exports = router;