const axios = require('axios');
const nodemailer = require('nodemailer');

module.exports.subscribe = async (req, res) => {
    try {
        const apiKey = process.env.MAILCHIMP_KEY;
        const listId = process.env.MAILCHIMP_LIST_ID;

        const header = {
            headers: {
                'authorization': "Basic " + Buffer.from('randomstring:' + apiKey).toString('base64'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = {
            status: 'subscribed',
            email_address: req.body.email
        };

        const url = `https://${apiKey.split('-')[1]}.api.mailchimp.com/3.0/lists/${listId}/members/`;
        await axios.post(url, body, header);

        res.status(200);
        res.json({status: 200, statusText: 'subscribed'});
    } catch(err) {
        console.log(err.response.data);
        res.status(err.response.data.status).send({ error: { messsage: err.response.data.detail } });
    }
};

module.exports.sendEmail = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass:  process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.DECENTER_EMAIL,
            subject: `CDP Saver: ${req.body.email}`,
            text: req.body.message
          };
          
        await transporter.sendMail(mailOptions);

        res.status(200);
        res.json({status: 200, statusText: 'sent'});

    } catch(err) {
        console.log(err);
        res.status(400).send({ error: { messsage: err } });
    }
};