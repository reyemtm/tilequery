const getXYZ = require("xyz-affair");
const {bbox, circle, booleanWithin} = require('@turf/turf');
const {promisfy} = require('promisfy');
const vt2geojson = promisfy(require('./vendor/@mapbox/vt2geojson/index.js'));

// import { getXYZ } from "xyz-affair"
// import {bbox, circle, booleanWithin} from '@turf/turf';
// import * as promisfy from 'promisfy';
// import * as vt2geojsonO from './vendor/@mapbox/vt2geojson/index.js'
// const vt2geojson = promisfy(vt2geojsonO)

function createTileURLS (obj, tiles) {
  return obj.reduce((i,o) => {
    // console.log(o)
    const url = tiles
    .replace('{x}', o.x)
    .replace('{y}', o.y)
    .replace('{z}', o.z);
    return [...i,url]
  }, [])
}

async function getFeatures(options) {
  // console.log(options);
  const query = await vt2geojson(options);
  return query
}

async function getFeaturesFromTiles (tileURLS, layer) {
  let geojson = {
    type: 'FeatureCollection',
    features: []
  };
  let index = []; // VECTOR TILE FEATURES MUST HAVE A UNIQUE ID!!!
  for (let i = 0; i < tileURLS.length; i++) {
    // console.log(tileURLS[i]);
    const uri = tileURLS[i];
    try {
      const queried = await getFeatures({uri, layer});
      queried.features.map(f => {
        if (!f.id && f.id != 0) throw new Error("features must have a unique id at the root of the feature")
        if (f.id && index.indexOf(f.id) < 0) {
          index.push(f.id);
          geojson.features.push(f)
        }
      })
    }
    catch (e) {
      //IGNORE ERRORS
      // console.error(e);
      // process.exit(0)
    }
  }
  return geojson
}

const setConfig = (config, userConfig) => { 
  for (let i in userConfig) config[i] = userConfig[i];
  return userConfig;
}

async function tilequery(options) {
  
  let config = {
    point: [-82.54, 39.11], 
    radius: 1,
    units: 'miles',
    tiles: 'https://tilequery.netlify.app/tiles/test/{z}/{x}/{y}.mvt',
    layer: 'test', 
    zoom: 14,
    buffer: false,
    pointInPolygon: false,
    logger: false
  }

  config = setConfig(config, options);

  if (config.logger) console.log(config)

  if (!config || !config.point || !config.radius || !config.units || !config.tiles || !config.layer || config.zoom === null || config.zoom === undefined) {
    throw new Error ('missing required config parameters')
  }

  const pointFeature = {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": config.point
    }
  }

  //considered replacing with cheap ruler but this only takes 30 ms

  // const bufferedPoint = buffer(pointFeature, config.radius, {units: config.units});
  const bufferedPoint = circle(config.point, config.radius, {units: config.units, steps: 500});
  const bounds = bbox(bufferedPoint);

  // console.log(bbox)
  const xyz = getXYZ([ [bounds[0],bounds[1]], [bounds[2],bounds[3]] ], config.zoom);

  // console.log(xyz)

  const timer = Date.now()

  const urls = createTileURLS(xyz, config.tiles);

  const geojson = await getFeaturesFromTiles(urls, config.layer)
  if (config.logger) {
    console.log('total features found: ', geojson.features.length)
    console.log('query execution time (seconds): ', (Date.now() - timer)/1000)
  }

  
  if (config.buffer) {
    const within = {
      type: "FeatureCollection",
      features: []
    }
    
    for (let i = 0; i < geojson.features.length; i++) {
      if (booleanWithin(geojson.features[i], bufferedPoint)) within.features.push(geojson.features[i])
    }

    if (config.logger) console.log("features returned within buffer: ", within.features.length)

    return within

  }
  if (config.pointInPolygon) {

    const polygon = {
      type: "FeatureCollection",
      features: []
    }

    for (let i = 0; i < geojson.features.length; i++) {
      if (booleanWithin(pointFeature, geojson.features[i])) {
        polygon.features.push(geojson.features[i])
      }
    }
    if (config.logger) console.log("polygon features found:", polygon.features.length)
    return polygon
  }
  return geojson
}

module.exports = tilequery