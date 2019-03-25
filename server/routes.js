const router = require('express').Router();

const emailService = require('./emailService');

router.post('/subscribe/', (req, res) => { emailService.subscribe(req, res); });
router.post('/send_email/', (req, res) => { emailService.sendEmail(req, res); });

module.exports = router;