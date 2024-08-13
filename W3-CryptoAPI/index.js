const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <form action="/" method="post">
            <label for="crypto">Cryptocurrency:</label>
            <input type="text" id="crypto" name="crypto" placeholder="e.g. bitcoin, ethereum" required>
            <button type="submit">Get Price</button>
        </form>
    `);
});

app.post('/', (req, res) => {
    const crypto = req.body.crypto.toLowerCase();
    const url = `https://blockchain.info/ticker`;

    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            if (data.USD) {
                res.send(`Price of ${crypto.charAt(0).toUpperCase() + crypto.slice(1)} in USD: $${data.USD.last}`);
            } else {
                res.send('Cryptocurrency not found');
            }
        } else {
            res.send('Error fetching data');
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
