var _     = require('lodash');
var turf = require("@turf/turf");
var tilebelt = require("@mapbox/tilebelt");

module.exports = function(data, tile, writeData, done) {

  //Extract the osm layer from the mbtile
  var layer = data.osm.osm;

  // var thisTile =  tilebelt.tileToQuadkey(tile);

  // var totals = {
  //   'features'         : layer.features.length,
  //   'totalKM'          : countKM(layer.features),
  //   'totalBuildings'   : countBuildings(layer.features),
  //   'totalPOIs'        : countPOIs(layer.features)
  // }

  //iterate through the features and spit out anything with mapillary in it?

  var matched = {}

  mapOptions.forEach(function(term){
    matched[term] = {}
  })

  layer.features.forEach(function(feat){
    Object.keys(feat.properties).forEach(function(tag){
      // if (tag.substring(0,1)!='@'){
        string = JSON.stringify(feat.properties[tag]).toLowerCase()
        mapOptions.forEach(function(term){
          if (string.indexOf(term) > -1){
            var kv = (tag + "-->" +feat.properties[tag]).toLowerCase()
            if (!matched[term].hasOwnProperty(kv)){
              matched[term][kv] = 1
            }else{
              matched[term][kv]++;
            }
            // writeData(JSON.stringify(feat)+"\n")
          }
        })
      // }
    })
  })

  // //A new approach: group features on tiles by users:
  // // var gbUsers = _.groupBy(layer.features, function(f){return f.properties['@user']})
  //
  // //Iterate through the data teams and see what users exist?
  // // Object.keys(global.mapOptions).forEach(function(team){
  //   //Iterate through actual team members.
  //   Object.keys(global.mapOptions[team]).forEach(function(user){
  //     if (gbUsers.hasOwnProperty(user)){
  //       var feats = JSON.parse(JSON.stringify(gbUsers[user])) //a cheep deepcopy :)
  //
  //       if (global.mapOptions[team][user].hasOwnProperty('f')){
  //         feats = feats.filter(function(f){
  //           return f.properties['@timestamp'] > global.mapOptions[team][user].f
  //         })
  //       }
  //       if (global.mapOptions[team][user].hasOwnProperty('t')){
  //         feats = feats.filter(function(f){
  //           return f.properties['@timestamp'] > global.mapOptions[team][user].f
  //         })
  //       }
  //
  //       if (feats.length){
  //         if (dataTeams.hasOwnProperty(team) ){
  //           dataTeams[team] = dataTeams[team].concat(feats);
  //         }else{
  //           dataTeams[team] = feats
  //         }
  //       }
  //     }
  //   })
  // })
  //
  // // Simplify for summaries
  // Object.keys(dataTeams).forEach(function(team){
  //
  //   var count=0;
  //   dataTeams[team].forEach(function(f){
  //     if (f.hasOwnProperty('properties') ){
  //       count++;
  //     }
  //   })
  //   if (count < dataTeams[team].length){
  //     console.warn(team, count, JSON.stringify(dataTeams[team]))
  //   }
  //
  //   var gbDay = _.groupBy(dataTeams[team],function(feat){
  //     return Math.floor(feat.properties['@timestamp']/86400)
  //   });
  //
  //   Object.keys(gbDay).forEach(function(day){
  //     if (!dataTeamCounts.hasOwnProperty(team) ){
  //       dataTeamCounts[team] = {}
  //     }
  //
  //     var dailyKM        = countKM(gbDay[day]);
  //     var dailyBuildings = countBuildings(gbDay[day]);
  //     var dailyPOIs      = countPOIs(gbDay[day]);
  //     var dailyEdits     = gbDay[day].length
  //
  //     dataTeamCounts[team][day] = {
  //       'km': dailyKM,
  //       'b' : dailyBuildings,
  //       'p' : dailyPOIs,
  //       'e' : dailyEdits
  //     }
  //     try{
  //       var center = turf.center({
  //           'type':'GeometryCollection',
  //           'geometries': gbDay[day].map(function(f){return f.geometry})
  //       })
  //     }catch(e){
  //       console.warn("FAILED TURF.CENTER | feats: ",gbDay[day].length)
  //       center = {'properties':{}}
  //     }
  //
  //     center.properties['edits'] = gbDay[day].length;
  //     center.properties['b']     = dailyBuildings;
  //     center.properties['km']    = dailyKM;
  //     center.properties['p']     = dailyPOIs;
  //     center.properties['day']   = Number(day);
  //     center.properties['team']  = team;
  //     center.properties['tile']  = thisTile;
  //     writeData(JSON.stringify(center)+"\n")
  //   })
  // })
  done(null, matched)
};
