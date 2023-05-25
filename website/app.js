// HTML Elements
const portrait = document.getElementById("portrait");
const endorsement = document.getElementById("endorsement");

const tank = document.getElementById("tank");
const dps = document.getElementById("dps");
const support = document.getElementById("support");

const tankRank = document.getElementById("tankRank");
const dpsRank = document.getElementById("dpsRank");
const supportRank = document.getElementById("supportRank");


// Get the config & run the API fetching
fetch('../config.json')
    .then(res => res.json())
    .then(data => {
        if (data.ranksOnly) {
            document.getElementById("top").style.display = "none";
        }
        update(data);
        setInterval(() => update(data), data.updateTime * 1000);
    })
    .catch(err => {
        console.error("An error occured reading config.json: ", err);
    });



function update(config) {
    console.log("Updating Data");
    fetch(`http://localhost:${config.port}/fetch`)
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                console.log(`Received error "${data.error}" from API, ignoring any changes to the images.`);
                return;
            }

            portrait.src = data.portrait;
            endorsement.src = data.endorsement;

            checkRole(tank, tankRank, data.hasTank, data.tankRank);
            checkRole(dps, dpsRank, data.hasDPS, data.dpsRank);
            checkRole(support, supportRank, data.hasSupport, data.supportRank);

        });
}


function checkRole(role, rank, exists, rankURL) {
    if (exists) {
        role.style.display = "block";

        rank.src = rankURL;
        rank.style.display = "block";
    } else {
        role.style.display = "none";
        rank.style.display = "none";
    }
}
