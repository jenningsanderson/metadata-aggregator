var _     = require('lodash');
var turf = require("@turf/turf");
var tilebelt = require("@mapbox/tilebelt");

module.exports = function(data, tile, writeData, done) {

  //Extract the osm layer from the mbtile
  var layer = data.osm.osm;

  var matched = {}

  mapOptions.forEach(function(term){
    matched[term] = {}
  })

  layer.features.forEach(function(feat){
    Object.keys(feat.properties).forEach(function(tag){
      if (tag.substring(0,1)!='@'){
        string = JSON.stringify(feat.properties[tag]).toLowerCase()
        mapOptions.forEach(function(term){
          if (string.indexOf(term) > -1){
            var kv = (tag + "-->" +feat.properties[tag]).toLowerCase()
            if (!matched[term].hasOwnProperty(kv)){
              matched[term][kv] = 1
            }else{
              matched[term][kv]++;
            }
            feat.properties['@matched'] = term
            feat.tippecanoe = {'minzoom':12,'maxzoom':15,'layer':'geometries'}
            writeData(JSON.stringify(feat)+"\n")
          }
        })
      }
    })
  })

  // Simplify for summaries

  var thisTile =  tilebelt.tileToGeoJSON(tile);
  var center = turf.center(thisTile)

  Object.keys(matched).forEach(function(term){
    if (Object.keys(matched[term]).length){
      center.properties[term] = Object.keys(matched[term]).map((t)=>{return matched[term][t]}).reduce((a,b)=>{return a+b})
      center.tippecanoe = {'minzoom':1,'maxzoom':12,'layer':'summary'}
      writeData(JSON.stringify(center)+"\n")
    }
  });

  done(null, matched)
};
