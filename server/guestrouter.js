const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('goody')
});

router.get('/spam', (req, res)=>{ res.send('spam')});

module.exports = router;