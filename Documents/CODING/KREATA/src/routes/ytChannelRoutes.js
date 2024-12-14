// src/routes/channelRoutes.js
const express = require('express');
const { saveChannels,addChannel,takeSnapshot } = require('../controllers/channelController');

const router = express.Router();

// Route to save channels
router.post('/save-channels', saveChannels);
router.post('/add-channel', addChannel);
router.post('/snapshot-channel', takeSnapshot);

module.exports = router;
