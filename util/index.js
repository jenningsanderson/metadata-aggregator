'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var _ = require('lodash')

var searchTerms = ["mapillary"]

var matched = {}
searchTerms.forEach(function(term){
  matched[term] = {}
})

var dailyCounts = {}
tileReduce({
    map: path.join(__dirname, "map-tag-finder.js"),
    zoom: 12,
    sources: [{name: 'osm', mbtiles: path.join("/data/planet/latest.planet.mbtiles"), raw: false}],
    // output: fs.createWriteStream('../data/tileSummaries.geojsonseq'),
    // bbox: [-105.10,14.39,-100.49,20.72],
    // bbox: [-178.44,18.86,-154.76,28.52],
   // bbox: [-74.5903,40.4774,-73.4256,41.1773],
    //bbox: [-79.7619,40.4774,-71.7956,45.0159],
    mapOptions: searchTerms
})
.on('reduce', function(res){
  //Iterate through the terms that came back
  Object.keys(res).forEach(function(term){
    //Iterate through the KVs for each term
    Object.keys(res[term]).forEach(function(kv){
      if (!matched[term].hasOwnProperty(kv)){
        matched[term][kv] = res[term][kv]
      }else{
        matched[term][kv] += res[term][kv];
      }
    })
  })
})
.on('end', function(){
  console.log("DONE")
  console.log(JSON.stringify(matched, null,2))

  Object.keys(matched).forEach(function(term){
    console.log(term+"\n"+"===============")
    //Iterate through the KVs for each term
    var sortedTerms = []
    Object.keys(matched[term]).forEach(function(kv){
      sortedTerms.push({n:kv, c:matched[term][kv]})
    })
    _.sortBy(sortedTerms,(x)=>{return -x.c}).slice(0,10).forEach(function(val){
      console.log(val.n, val.c)
    })
  })

  // var dailySummaries = fs.createWriteStream('../data/summary-totals.csv');
  // dailySummaries.write("day\t")
  // var teams = Object.keys(dataTeams)
  // teams.forEach(function(team){
  //   dailySummaries.write(team + "\t")
  //   dailySummaries.write(team + "-km\t")
  //   dailySummaries.write(team + "-b\t")
  //   dailySummaries.write(team + "-p\t")
  // });
  // dailySummaries.write("\n")
  //
  // Object.keys(dailyCounts).forEach(function(day){
  //   var row = [Number(day)]
  //   teams.forEach(function(team){
  //     if (dailyCounts[day].hasOwnProperty(team) ){
  //       row.push (dailyCounts[day][team]['e'])
  //       row.push (dailyCounts[day][team]['km'])
  //       row.push (dailyCounts[day][team]['b'])
  //       row.push (dailyCounts[day][team]['p'])
  //     }else{
  //       row.push(0);row.push(0);row.push(0);row.push(0)
  //     }
  //   });
  //   dailySummaries.write(row.join("\t")+"\n")
  // });
  // console.warn("Done");
})
