const tilequery = require("./tilequery.js");

//Using imports
// import {tilequery} from "./tilequery.js"

(async function test() {
  const now = Date.now()
  const features = await tilequery({
    point: [-82.54, 39.11], 
    radius: 1,
    units: 'miles',
    tiles: 'https://reyemtm.github.io/tilequery/tiles/{z}/{x}/{y}.mvt',
    layer: 'test', 
    zoom: 14,
    buffer: true
  });

  console.log("timer:", Date.now() - now, "ms")
  console.log("features found:", features.features.length)
})()