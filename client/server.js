const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const datefomart = require('dateformat');
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
        let title = 'Peer to Peer Betting';
        let description = '';

        const staticPageFound = pagesData.find(page => page.path == path);
        if (staticPageFound) {
            try {
                const { data } = await axios.get(`${serverUrl}/meta/${encodeURIComponent(staticPageFound.title)}`);
                console.log(data);
                if (data) {
                    const { title: metaTitle, description: metaDescription } = data;
                    title = metaTitle;
                    description = metaDescription;
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            if (path.startsWith('/sport')) {
                const urlParams = path.split('/');
                const sportName = urlParams[2];
                const leagueId = urlParams[4];
                const eventId = urlParams[6];
                if (leagueId) { // Has league
                    try {
                        const { data } = await axios.get(`${serverUrl}/sport?name=${sportName}&leagueId=${leagueId}`);
                        if (data) {
                            const { league: { name: leagueName, events } } = data;
                            if (eventId) {  // Has Event
                                const { uniqueId } = req.query;
                                const event = events.find((event) => event.originId == eventId);
                                if (event) { // Event is valid
                                    if (uniqueId) {
                                        try {
                                            const { data } = await axios.get(`${serverUrl}/share-line?uniqueId=${uniqueId}`);
                                            if (data) {
                                                const { user: { firstname }, eventDate } = data;
                                                title = `Bet with or against ${firstname}`;
                                                description = `Bet with or against ${firstname} on the ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) on ${datefomart(eventDate, "default")}`
                                            } else {
                                                title = `Bet on ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}).`;
                                                description = `${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Odds | ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Betting`;
                                            }
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }
                                    else {
                                        title = `Bet on ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}).`;
                                        description = `${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Odds | ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Betting`;
                                    }
                                }
                            } else { // League
                                title = `Bet on ${leagueName}(${sportName}).`;
                                description = `${leagueName}(${sportName}) Odds | ${leagueName}(${sportName}) Betting`;
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                } else { // Sport
                    title = `Bet on ${sportName}.`;
                    description = `${sportName} Odds | ${sportName} Betting`;
                }
            }

        }

        const meta = `
        <title>${title} | PAYPER WIN | Risk Less, Win more</title>
        <meta name="description" content="${description}">

        <meta itemprop="name" content="${title} | PAYPER WIN | Risk Less, Win more">
        <meta itemprop="description" content="${description}">
        <meta itemprop="image" content="https://www.payperwin.co/images/meta_image.jpeg">

        <meta property="og:type" content="website">
        <meta property="og:title" content="${title} | PAYPER WIN | Risk Less, Win more">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="https://www.payperwin.co/images/meta_image.jpeg">

        <meta name="twitter:title" content="${title} | PAYPER WIN | Risk Less, Win more">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="https://www.payperwin.co/images/meta_image.jpeg">
        `;

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