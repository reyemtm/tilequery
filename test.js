const tilequery = require("./tilequery.js");

tilequery({
  point: [-82.54, 39.11], 
  radius: 1,
  units: 'miles',
  tiles: 'https://reyemtm.github.io/tilequery/tiles/{z}/{x}/{y}.mvt',
  layer: 'test', 
  zoom: 14,
  buffer: true
})