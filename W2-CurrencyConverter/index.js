const express = require('express');
const app = express();

const bodyParser = require('body-parser'); //For reading the input from the form
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    var amount = (req.body.amount);
    var result
    if (req.body.currency === 'usd') {
        result = amount * 0.27;
        res.send("Converted amount is: " + result + " USD");
    } 
    else if (req.body.currency === 'eur') {
        result = amount * 0.25;
        res.send("Converted amount is: " + result + " EUR");
    } 
    else if (req.body.currency === 'omr') {
        result = amount * 0.10;
        res.send("Converted amount is: " + result + " OMR");
    }
    });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
// To run the file and display it on the browser, use the following command: node index.js