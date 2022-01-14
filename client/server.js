const express = require("express");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const datefomart = require("dateformat");

const pagesData = require("./src/PPWAdmin/modules/meta-tags/redux/pages.json");
const _env = require("./src/env.json");
const { getSportName } = require("./src/libs/getSportName");
const serverUrl = _env.appUrl;
const port = _env.port;
const app = express();

// CORS
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     if (serverUrl != 'https://api.payperwin.com') {
//         res.header("X-Robots-Tag", "noindex");
//     }
//     next();
// });

app.use(compression());

const pathToIndex = path.join(__dirname, "serve/index.html");

app.use(express.static("dist"));
app.use(express.static("public"));

app.get(
    '/loaderio-3a03f54df9f87682c844b4fd4b9f87bf.txt',
    (req, res) => {
        res.send('loaderio-3a03f54df9f87682c844b4fd4b9f87bf');
    }
)

app.get("/*", (req, res) => {
    const { path } = req;
    fs.readFile(pathToIndex, "utf8", async (err, htmlData) => {
        if (err) {
            console.error("Error during file reading", err);
            return res.status(404).end();
        }
        // TODO get post info
        let title = "Peer to Peer Betting";
        let description = "Payper Win Is a Peer to Peer Betting Exchange offering a platform with better odds than anywhere else online. We are not a Bookie or HIGH STAKER and we are not affiliated with any HIGH STAKER. Place bets on your favorite sporting events worldwide. RISK less and WIN More!";
        let keywords = "payperwin,payper win,peer to peer,online betting,betting,sport";

        let staticPageFound = pagesData.find((page) => page.path == path);
        if (staticPageFound) {
            try {
                const { data } = await axios.get(
                    `${serverUrl}/meta/${encodeURIComponent(staticPageFound.title)}`
                );
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
                                                } - ${leagueName}(${sportName}) on ${datefomart(
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

        const meta = `
        <title>${title} | PAYPER WIN | Risk Less, Win more</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="${keywords}">

        <meta itemprop="name" content="${title} | PAYPER WIN | Risk Less, Win more">
        <meta itemprop="description" content="${description}">
        <meta itemprop="keywords" content="${keywords}">
        <meta itemprop="image" content="https://www.payperwin.com/images/PPW Meta.png">

        <meta property="og:type" content="website">
        <meta property="og:title" content="${title} | PAYPER WIN | Risk Less, Win more">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="https://www.payperwin.com/images/PPW Meta.png">

        <meta name="twitter:title" content="${title} | PAYPER WIN | Risk Less, Win more">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="https://www.payperwin.com/images/PPW Meta.png">
        `;

        // TODO inject meta tags
        htmlData = htmlData.replace(`<meta name="replace">`, meta);
        return res.send(htmlData);
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`)); // eslint-disable-line