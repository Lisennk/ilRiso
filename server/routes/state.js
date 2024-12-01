const express = require('express');
const router = express.Router();
const StateController = require('../http/StateController');

router.post('/completions', StateController.createCompletion);

module.exports = router; 