# Overwatch OBS
Please note that this is still in very early development and bugs are to be expected, although generally I try to test my code as much as possible before pushing!

## Installation

### You can also check out this official guide (Click on the image)!
[![Official guide](https://img.youtube.com/vi/Df9fZbjNqu4/0.jpg)](https://www.youtube.com/watch?v=Df9fZbjNqu4)

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
    "updateTime": 30,
    "ranksOnly": false
}
```

Your tag is something like `MattHere#2211`, which translates to `MattHere-2211`. Make sure your profile is not private!

The port you can leave as is, unless you're running something on port 3000 already.

The update time means how often you want to update the data (in seconds) - please note that there is a delay from when Overwatch updates your rank as well!

You can also hide the endorsement and portrait images if you only want to see your ranks.