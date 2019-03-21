const axios = require('axios');

module.exports.sendMail = async (req, res) => {
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