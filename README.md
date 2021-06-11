# tilequery
Query remote vector tiles and return point features within a bounding box or point buffer. The returned geojson is only as accurate as the data in the tiles, but the less tiles that need queried the faster the response, so the two factors need to be taken into account when utilizing tilequery.

A pre-built version is available in `docs/dist` and can be used directly in the browser with the global variable `tilequery`. For node, simply use `const tilequery = require("tilequery")`.

## Example

```JavaScript
const tilequery = require("tilequery");

(async function testTilequery() {
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
```
## Margins of Error in Vector Tiles

Keep in mind the margin of error per zoom level. The table below shows the margin of error for 40 points queried using `tilequery` starting at zoom level 4 compared to the original GeoJSON. Tiles were created with geojson-vt using default settings and errors were checked using Turf JS and `turf.distance()`.

| Zoom Level  | Error (ft)|
|:-:|-:|
| 4    | 811\.6139 |
| 5    | 322\.6163 |
| 6    | 170\.7157 |
| 7    | 78\.1861|
| 8    | 40\.4505|
| 9    | 18\.8305|
| 10   | 9\.0808 |
| 11   | 5\.4247 |
| 12   | 2\.6212 |
| 13   | 1\.1149 |
| 14   | 0\.5900 |
| 15   | 0\.2986 |
| 16   | 0\.1576 |
| 17   | 0\.0682 |
| 18   | 0\.0347 |

---

### Version Notes
- 0.4.0 - *Help wanted to convert to ES6.*
- 0.3.2 - Replaced ``turf.buffer()`` with ``turf.circle()`` due to distance errors in ``turf.buffer()``

### Related

https://github.com/stevage/QueryRemoteTiles#readme

https://github.com/mapbox/vtquery