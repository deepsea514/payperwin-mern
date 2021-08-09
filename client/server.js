const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
require('dotenv').config();

const pagesData = require('./src/PPWAdmin/modules/meta-tags/redux/pages.json');
const config = require('../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

const app = express();

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(compression());

const pathToIndex = path.join(__dirname, "serve/index.html");

app.use(express.static('dist'));
app.use(express.static('public'));

app.get("/*", (req, res) => {
    const { path } = req;
    fs.readFile(pathToIndex, 'utf8', async (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        // TODO get post info
        let meta = `
        <title>Peer to Peer Betting | PAYPER WIN | Risk Less, Win more</title>
        <meta name="description" content="">

        <meta itemprop="name" content="Peer to Peer Betting | PAYPER WIN | Risk Less, Win more">
        <meta itemprop="description" content="">
        <meta itemprop="image" content="https://www.payperwin.co/images/Banner 1.jpg">

        <meta property="og:type" content="website">
        <meta property="og:title" content="Peer to Peer Betting | PAYPER WIN | Risk Less, Win more">
        <meta property="og:description" content="">
        <meta property="og:image" content="https://www.payperwin.co/images/Banner 1.jpg">

        <meta name="twitter:title" content="Peer to Peer Betting | PAYPER WIN | Risk Less, Win more">
        <meta name="twitter:description" content="">
        <meta name="twitter:image" content="https://www.payperwin.co/images/Banner 1.jpg">
        `;

        const staticPageFound = pagesData.find(page => page.path == path);
        if (staticPageFound) {
            try {
                const { data } = await axios.get(`${serverUrl}/meta/${encodeURIComponent(staticPageFound.title)}`);
                console.log(data);
                if (data) {
                    const { title, description, keywords } = data;
                    meta = `
                    <title>${title} | PAYPER WIN | Risk Less, Win more</title>
                    <meta name="description" content="${description}">
            
                    <meta itemprop="name" content="${title} | PAYPER WIN | Risk Less, Win more">
                    <meta itemprop="description" content="${description}">
                    <meta itemprop="image" content="https://www.payperwin.co/images/Banner 1.jpg">
            
                    <meta property="og:type" content="website">
                    <meta property="og:title" content="${title} | PAYPER WIN | Risk Less, Win more">
                    <meta property="og:description" content="${description}">
                    <meta property="og:image" content="https://www.payperwin.co/images/Banner 1.jpg">
            
                    <meta name="twitter:title" content="${title} | PAYPER WIN | Risk Less, Win more">
                    <meta name="twitter:description" content="${description}">
                    <meta name="twitter:image" content="https://www.payperwin.co/images/Banner 1.jpg">
                    `;
                }
            } catch (error) {
                console.log(error);
            }
        }

        // TODO inject meta tags
        htmlData = htmlData.replace(
            `<meta name="replace">`,
            meta
        )
        return res.send(htmlData);
    });
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
    console.log(process.env.NODE_ENV, 'mode');
    const port = 8000;
    app.listen(port, () => console.log(`Server listening on port ${port}!`)); // eslint-disable-line
}