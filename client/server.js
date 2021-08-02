const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const app = express();
const config = require('../config.json')

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(compression());
app.use(express.static('dist'));
app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV === 'development2') {
    // Https
    const port = 2082;
    const pathToCerts = '';
    const key = fs.readFileSync(`${pathToCerts}cert.key`);
    const cert = fs.readFileSync(`${pathToCerts}cert.cer`);
    https.createServer({
        key,
        cert,
    }, app).listen(port, () => console.log(`API Server listening on port ${port}`));
} else {
    const port = config.clientPort;
    app.listen(port, () => console.log(`Server listening on port ${port}!`)); // eslint-disable-line
}