# tilequery
Query remote vector tiles and return point features within a bounding box or point buffer. The returned geojson is only as accurate as the data in the tiles, but the less tiles that need queried the faster the response, so the two factors need to be taken into account when utilizing tilequery.

## Margin of Error (ft)

| Zoom Level  | Error               |
|------|-----------------------|
| 4    | 811\.6139435843482    |
| 5    | 322\.6163624599873    |
| 6    | 170\.71576163793728   |
| 7    | 78\.18612686834014    |
| 8    | 40\.45052686716928    |
| 9    | 18\.830525929341974   |
| 10   | 9\.080881940928082    |
| 11   | 5\.424733944507352    |
| 12   | 2\.621289680093692    |
| 13   | 1\.1149289688211197   |
| 14   | 0\.5900853859153864   |
| 15   | 0\.2986825658321046   |
| 16   | 0\.15763084481808604  |
| 17   | 0\.06828433432238892  |
| 18   | 0\.034727085753166215 |

Keep in mind the margin of error per zoom level. The table above shows the margin of error for 40 points queried using tilequery starting at zoom level 4 compared to the original GeoJSON. Tiles were created with geojson-vt using default settings and errors were checked using Turf JS.