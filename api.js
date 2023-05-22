const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const app = express();

app.use(cors());

function startEndpoint() {
    app.get('/fetch', async (req, res) => {
        try {
            const url = `https://overwatch.blizzard.com/en-us/career/${config.tag}`;

            const response = await axios.get(url);

            const $ = cheerio.load(response.data);

            const isPrivate = $('.Profile-player--privateText').length > 0;
            
            if (isPrivate) {
                console.log(`Error: account associated with tag "${config.tag}" is private.`);
                res.status(403).json({ error: "Player profile is private." });
                return;
            }

            const portrait = $('.Profile-player--portrait').attr('src');
            const endorsement = $('.Profile-playerSummary--endorsement').attr('src');

            roleRanks = $('.Profile-playerSummary--rank')

            tankRank = $(roleRanks[0]).attr('src');
            dpsRank = $(roleRanks[1]).attr('src');
            supportRank = $(roleRanks[2]).attr('src');

            const data = {
                portrait,
                endorsement,
                tankRank,
                dpsRank,
                supportRank,
            }

            res.json(data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log(`Error: the tag "${config.tag}" does not seem to exist.`);
            } else if (err.response && err.response.status === 502) {
                console.log(`Error: Bad Gateway error (502) occured.`);
                res.status(502).json({ error: "Bad Gateway error (502) occured." })
            } else {
                console.log(`Error: ${err}`)
            }

            res.status(500).json({ error: "Server side error! Check your terminal for more information." });
        }
    });

    return app.listen(config.port, () => {
        console.log(`Endpoint "/fetch" started on port ${config.port}`)
    });
}

let server = startEndpoint();

fs.watch('./config.json', (eventType, filename) => {
    if (eventType === 'change' && filename) {
        console.log("Configuration changed! Restarting API.");
        server.close(() => {
            Object.keys(require.cache).forEach((key) => {
                delete require.cache[key];
            });

            config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

            server = startEndpoint();

        });
    }
});
