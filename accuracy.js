const tilequery = require("./tilequery.js");
const turf = require("@turf/turf");
const fs = require("fs");
const arraySort = require("array-sort");

async function query(zoomlevel) {
  var geojson = await tilequery({
    point: [-82.54, 39.11],
    radius: 1400,
    units: 'feet',
    tiles: 'http://localhost:5500/docs/tiles/{z}/{x}/{y}.mvt',
    layer: 'test',
    zoom: zoomlevel,
    buffer: true
  });

  return geojson

}

var baselineFeatures = JSON.parse(fs.readFileSync("./docs/test.geojson"));

var accuracy = [];

for (var i = 1; i < 19; i++) {

  const index = i;

  query(i).then(data => {
    const index2 = i;
    var distances = [];

    data.features.map(f => {
      f.properties = {};
      var baselineFeature = baselineFeatures.features.filter(b => {
        return (b.id - 1) === f.id
      });
      if (baselineFeature.length > 0) {
        baselineFeature[0].properties = {}
        var error = turf.distance(baselineFeature[0], f, {
          units: "feet"
        });
        distances.push(error);
      }
    });

    if (distances.length > 0) {
      var marginoferror = distances.reduce((a, b) => {
        return a + b
      }, 0);

      marginoferror = marginoferror / (distances.length - 1)

      console.log(index, index2)

      accuracy.push({
        zoom: index,
        error: marginoferror
      });
      console.log(accuracy)
    }

    console.log(i)
    if (i === 19) {
      var sorted = arraySort(accuracy, "zoom")
      fs.writeFileSync("test/accuracy.json", JSON.stringify(sorted, 0, 2))
    }

  })
}