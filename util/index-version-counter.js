'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

var globalSums = {
  'highway':{},
  'amenity':{},
  'building':{},
  'other':{}
}


var dailyCounts = {}
tileReduce({
    map: path.join(__dirname, "map-version-counter.js"),
    zoom: 12,
    sources: [{name: 'osm', mbtiles: path.join("/data/planet/latest.planet.mbtiles"), raw: false}],
    // output: fs.createWriteStream('../data/tileSummaries.geojsonseq'),
//     bbox: [-105.10,14.39,-100.49,20.72],
    // bbox: [-178.44,18.86,-154.76,28.52],
   // bbox: [-74.5903,40.4774,-73.4256,41.1773],
    //bbox: [-79.7619,40.4774,-71.7956,45.0159],
})
.on('reduce', function(res){
  //Iterate through the terms that came back
  Object.keys(res).forEach(function(term){
    //Iterate through the KVs for each term
    Object.keys(res[term]).forEach(function(kv){
      if (!globalSums[term].hasOwnProperty(kv)){
        globalSums[term][kv] = res[term][kv]
      }else{
        globalSums[term][kv] += res[term][kv];
      }
    })
  })
})
.on('end', function(){
  console.log("DONE")
  fs.writeFileSync('global_sums_no_bots_imports_tiger.json',JSON.stringify(globalSums, null,2))

  Object.keys(globalSums).forEach(function(term){
    console.log(term+"\n"+"===============")
    //Iterate through the KVs for each term
    var sortedTerms = []
    Object.keys(globalSums[term]).forEach(function(kv){
      sortedTerms.push({n:kv, c:globalSums[term][kv]})
    })
    _.sortBy(sortedTerms,(x)=>{return -x.c}).slice(0,10).forEach(function(val){
      console.log(val.n, val.c)
    })
  })
})
