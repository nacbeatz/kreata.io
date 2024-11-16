// src/routes/channelRoutes.js
const express = require('express');
const { saveChannels } = require('../controllers/channelController');

const router = express.Router();

// Route to save channels
router.post('/save-channels', saveChannels);

module.exports = router;
