const express = require("express");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const dateformat = require("dateformat");
const convert = require('xml-js');
const app = express();
const basicAuth = require('express-basic-auth');

const pagesData = require("./src/PPWAdmin/modules/meta-tags/redux/pages.json");
const _env = require("./src/env.json");
const { getSportName } = require("./src/libs/getSportName");
const serverUrl = _env.appUrl;
const port = _env.port;
const sitemap = require('./sitemap.json');

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (serverUrl != 'https://api.payperwin.com') {
        res.header("X-Robots-Tag", "noindex");
    }
    next();
});

app.use(compression());
if (serverUrl != 'https://api.payperwin.com') {
    app.use(basicAuth({
        users: { 'ppwdev': 'justin' },
        challenge: true,
    }))
}

const pathToIndex = path.join(__dirname, "serve/index.html");
const pathToWidget = path.join(__dirname, "serve/widget.html");

app.use(express.static("dist"));
app.use(express.static("public"));

app.get(
    '/sitemap_index.xml',
    async (req, res) => {
        try {
            const { data: articles } = await axios.get(`${serverUrl}/articles/meta`);
            articles.map(article => {
                sitemap.elements[0].elements.push({
                    "type": "element",
                    "name": "url",
                    "elements": [
                        {
                            "type": "element",
                            "name": "loc",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": `https://payperwin.com/articles/${article.permalink}`
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "lastmod",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": dateformat(article.updated_at, "yyyy-mm-dd")
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "changefreq",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "weekly"
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "priority",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "0.5"
                                }
                            ]
                        }
                    ]
                })
            })
        } catch (error) { }
        const result = convert.js2xml(sitemap);
        res.set('Content-Type', 'text/xml');
        return res.send(result);
    }
)

app.get(
    '/widget',
    async (req, res) => {
        fs.readFile(pathToWidget, "utf8", async (err, htmlData) => {
            if (err) {
                console.error("Error during file reading", err);
                return res.status(404).end();
            }
            return res.send(htmlData);
        });
    }
)

app.get("/*", (req, res) => {
    const { path } = req;
    fs.readFile(pathToIndex, "utf8", async (err, htmlData) => {
        if (err) {
            console.error("Error during file reading", err);
            return res.status(404).end();
        }
        // Change Meta Infos
        let title = "Peer to Peer Betting | PAYPER WIN | Risk Less, Win more";
        let description = "Payper Win Is a Peer to Peer Betting Exchange offering a platform with better odds than anywhere else online. We are not a Bookie or HIGH STAKER and we are not affiliated with any HIGH STAKER. Place bets on your favorite sporting events worldwide. RISK less and WIN More!";
        let keywords = "payperwin,payper win,peer to peer,online betting,betting,sport";
        let metaimage = "https://www.payperwin.com/images/PPW%20Meta.png";
        try {
            const { data } = await axios.get(`${serverUrl}/meta`, { params: { title: 'Peer to Peer Betting' } });
            if (data) {
                const { title: metaTitle, description: metaDescription, keywords: metaKeywords } = data;
                title = metaTitle;
                description = metaDescription;
                keywords = metaKeywords;
            } else {
                staticPageFound = false;
            }
        } catch (error) { }

        let staticPageFound = pagesData.find((page) => page.path == path);
        if (staticPageFound && path != '/') {
            try {
                const { data } = await axios.get(`${serverUrl}/meta`, { params: { title: staticPageFound.title } });
                if (data) {
                    const { title: metaTitle, description: metaDescription, keywords: metaKeywords } = data;
                    title = metaTitle;
                    description = metaDescription;
                    keywords = metaKeywords;
                } else {
                    staticPageFound = false;
                }
            } catch (error) {
                staticPageFound = false;
            }
        }

        if (!staticPageFound && path.startsWith("/sport")) {
            const urlParams = path.split("/");
            const shortName = urlParams[2];
            const sportName = getSportName(shortName);
            const leagueId = urlParams[4];
            const eventId = urlParams[6];
            if (leagueId) {
                // Has league
                try {
                    const { data } = await axios.get(
                        `${serverUrl}/sport?name=${shortName}&leagueId=${leagueId}`
                    );
                    if (data) {
                        const league = data.leagues[0];
                        const { name: leagueName, events } = league;
                        if (urlParams[5] == 'event' && eventId) {  // Has Event
                            const { uniqueId } = req.query;
                            const event = events.find((event) => event.originId == eventId);
                            if (event) {
                                // Event is valid
                                if (uniqueId) {
                                    try {
                                        const { data } = await axios.get(
                                            `${serverUrl}/share-line?uniqueId=${uniqueId}`
                                        );
                                        if (data) {
                                            const {
                                                user: { firstname },
                                                eventDate,
                                            } = data;
                                            title = `Bet with or against ${firstname}`;
                                            description = `Bet with or against ${firstname} on the ${event.teamA
                                                } vs ${event.teamB
                                                } - ${leagueName}(${sportName}) on ${dateformat(
                                                    eventDate,
                                                    "default"
                                                )}`;
                                        } else {
                                            title = `Bet on ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}).`;
                                            description = `${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Odds | ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Betting`;
                                        }
                                    } catch (error) {
                                        console.error(error);
                                    }
                                } else {
                                    title = `Bet on ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}).`;
                                    description = `${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Odds | ${event.teamA} vs ${event.teamB} - ${leagueName}(${sportName}) Betting`;
                                }
                            }
                        } else {
                            // League
                            title = `Bet on ${leagueName}(${sportName}).`;
                            description = `${leagueName}(${sportName}) Odds | ${leagueName}(${sportName}) Betting`;
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                // Sport
                title = `Bet on ${sportName}.`;
                description = `${sportName} Odds | ${sportName} Betting`;
            }
        }

        if (!staticPageFound && path.startsWith("/articles")) {
            const urlParams = path.split("/");
            const permalink = urlParams[2];
            if (permalink != 'category') {
                try {
                    const { data } = await axios.get(`${serverUrl}/article/detail`, { params: { permalink } });
                    if (data) {
                        title = data.meta_title;
                        description = data.meta_description;
                        keywords = data.meta_keywords;
                        if (data.logo.startsWith('/static')) {
                            metaimage = serverUrl + data.logo;
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        const meta = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="${keywords}">

        <meta itemprop="name" content="${title}">
        <meta itemprop="description" content="${description}">
        <meta itemprop="keywords" content="${keywords}">
        <meta itemprop="image" content="${metaimage}">

        <meta property="og:type" content="website">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${metaimage}">

        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${metaimage}">
        `;

        // TODO inject meta tags
        htmlData = htmlData.replace(`<meta name="replace">`, meta);
        return res.send(htmlData);
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`)); // eslint-disable-line