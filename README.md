# Overwatch OBS
Please note that this is not a full release, but a demo. At the moment, the web scraper does not take into account that you might not have ranks for all 3 roles, resulting in a faulty result (this will be fixed!).

Better README.md coming soon!

## Installation

- install the packages: `$ npm install`
- change the tag
- run the API: `$ npm run start` (you need to run this whenever you're using OBS, since it's how we get the statistics)
- add a local browser source to OBS
- set its source to `.../overwatch-obs/website/index.html`

## Configuration

For configuration, check the `config.json`!

```json
{
    "tag": "yourtag-1234",
    "port": 3000,
    "updateTime": 240,
    "hideEndorsement": false,
    "hidePortrait": false
}
```

Your tag is something like `MattHere#2211`, which translates to `MattHere-2211`. Make sure your profile is not private!

The port you can leave as is, unless you're running something on port 3000 already.

The update time means how often you want to update the data (in seconds) - please note that there is a delay from when Overwatch updates your rank as well!

You can also hide the endorsement and portrait images if you only want to see your ranks.

You can of course also change the frontend as you like, since it's vanilly HTMl, CSS and JS.

# Other notes

The server automatically restarts when you change the configuration, but the frontend page does not. This means you will have to refresh the page.