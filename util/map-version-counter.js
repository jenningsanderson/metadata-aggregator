module.exports = function(data, tile, writeData, done) {

  //Extract the osm layer from the mbtile
  var layer = data.osm.osm;
  
  var versionCounts = {
      'highway':{},
      'amenity':{},
      'building':{},
      'other':{}
  }

  layer.features.forEach(function(feat){  
    //filter out bots?
    if (feat.properties['@user'].toLowerCase().indexOf('bot') > -1) return; //woodpeck_fixbot
      
    if (feat.properties['@user'].toLowerCase().indexOf('import') > -1) return; // take out import data?
      
    if (feat.properties['@user'].toLowerCase().indexOf('tiger') > -1) return; // take out tiger data?
      
    if ( (feat.geometry.type==="LineString") && feat.properties.hasOwnProperty('highway') ){

      if ( !versionCounts.highway.hasOwnProperty(feat.properties['@version'].toString()) ){
        versionCounts.highway[feat.properties['@version'].toString()]=0;
      }
      versionCounts.highway[feat.properties['@version'].toString()]++;

    }else if ( feat.properties.hasOwnProperty('amenity') ){
      
      if ( !versionCounts.amenity.hasOwnProperty(feat.properties['@version'].toString()) ){
        versionCounts.amenity[feat.properties['@version'].toString()]=0;
      }
      versionCounts.amenity[feat.properties['@version'].toString()]++;

    }else if ( feat.properties.hasOwnProperty("building") && (feat.properties.building!="no") ){
      
      if ( !versionCounts.building.hasOwnProperty(feat.properties['@version'].toString()) ){
        versionCounts.building[feat.properties['@version'].toString()]=0;
      }
      versionCounts.building[feat.properties['@version'].toString()]++;
    
    }else{
      
      if ( !versionCounts.other.hasOwnProperty(feat.properties['@version'].toString()) ){
        versionCounts.other[feat.properties['@version'].toString()]=0;
      }
      versionCounts.other[feat.properties['@version'].toString()]++;
    }
  });

  done(null, versionCounts)
};