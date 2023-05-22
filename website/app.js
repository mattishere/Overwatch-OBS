fetch('../config.json')
    .then(res => res.json())
    .then(data => {
        update(data);
        setInterval(() => update(data), data.updateTime * 1000);
    })
    .catch(err => {
        console.error("An error occured reading config.json: ", err)
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

            const endorsement = document.getElementById("endorsement");
            if (config.hideEndorsement) {
                endorsement.style.display = "none";
            } else {
                endorsement.style.display = "block";
                endorsement.src = data.endorsement;
            }

            const portrait = document.getElementById("portrait");
            if (config.hidePortrait) {
                portrait.style.display = "none";
            } else {
                portrait.style.display = "block";
                portrait.src = data.portrait;
            }

            const tankRank = document.getElementById("tankRank");
            tankRank.src = data.tankRank;

            const dpsRank = document.getElementById("dpsRank");
            dpsRank.src = data.dpsRank;

            const supportRank = document.getElementById("supportRank");
            supportRank.src = data.supportRank;
        });
}
