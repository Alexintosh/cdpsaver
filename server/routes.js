const router = require('express').Router();

const emailService = require('./emailService');

router.post('/subscribe/', (req, res) => { emailService.sendMail(req, res); });

module.exports = router;