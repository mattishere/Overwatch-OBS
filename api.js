const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const app = express();
app.use(cors());



let config;
try {
    const configPath = process.env.OW_OBS_CONFIG_PATH ?? './config.json'
    config = JSON.parse(fs.readFileSync(configPath), 'utf-8');
    startEndpoint();
} catch (err) {
    console.log(`Error while reading 'config.json': ${err}`)
}


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

            let roleRanks = $('.Profile-playerSummary--rank');
            let roles = $('.Profile-playerSummary--role img');

            let hasTank = false;
            let hasDPS = false;
            let hasSupport = false;

            let tankRank, dpsRank, supportRank;

            if (roles.length === 3) {
                hasTank = true;
                hasDPS = true;
                hasSupport = true;
               
                tankRank = $(roleRanks[0]).attr('src');
                dpsRank = $(roleRanks[1]).attr('src');
                supportRank = $(roleRanks[2]).attr('src');


            } else {
                let tankURL = "https://static.playoverwatch.com/img/pages/career/icons/role/tank-f64702b684.svg#icon"
                let dpsURL = "https://static.playoverwatch.com/img/pages/career/icons/role/offense-ab1756f419.svg#icon"
                let supportURL = "https://static.playoverwatch.com/img/pages/career/icons/role/support-0258e13d85.svg#icon"

                let len = roles.length;

                for (let i = 0; i < len; i++) {
                    let src = $(roles[i]).attr('src');
                    switch (src) {
                        case tankURL:
                            hasTank = true;
                            tankRank = $(roleRanks[i]).attr('src');
                            break;
                        case dpsURL:
                            hasDPS = true;
                            dpsRank = $(roleRanks[i]).attr('src');
                            break;
                        case supportURL:
                            hasSupport = true;
                            supportRank = $(roleRanks[i]).attr('src');
                            break;
                    }
                }
            }


            const data = {
                portrait,
                endorsement,
                hasTank,
                hasDPS,
                hasSupport,
            }

            if (typeof tankRank !== 'undefined') {
                data.tankRank = tankRank;
            }

            if (typeof dpsRank !== 'undefined') {
                data.dpsRank = dpsRank;
            }

            if (typeof supportRank !== 'undefined') {
                data.supportRank = supportRank
            }

            res.json(data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log(`Error: the tag "${config.tag}" does not seem to exist.`);
                return res.status(500).json({ error: "invalid_tag" });
            } else if (err.response && err.response.status === 502) {
                console.log(`Error: Bad Gateway error (502) occured.`);
                return res.status(502).json({ error: "bad_gateway" })
            } else {
                console.log(`Error: ${err}`)
                return res.status(500).json({ error: "server_side" });
            }
        }
    });

    return app.listen(config.port, () => {
        console.log(`Endpoint "/fetch" started on port ${config.port}`)
    });
}
