// earthquake data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// fault lines data url
var boundary_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
// get earthquake data:
d3.json(earthquake_url, function(data){
   var quakeFeatures = data.features
   console.log(quakeFeatures)
    // earthquakes circle markers 
   var earthquakes = L.geoJSON(quakeFeatures, {
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng, 
          {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .75,
          color: "white",
          weight: 1

      })
    },
    onEachFeature: function (feature, layer){
        layer.bindPopup(`${feature.properties.place} <hr> Magnitude: ${feature.properties.mag} <br> Date: ${new Date(feature.properties.time)}`)
    }
  });

    d3.json(boundary_url, function(data){
        var faultFeatures = data.features
        // fault line coor
        var style = {
            "color": "orange",
            "fillOpacity":0 // diabled orange background color inside
        }
        console.log(faultFeatures)
        var faultLine = L.geoJSON(faultFeatures, {
            style: function(feature){
                return style
            }
        })
        createMap(earthquakes, faultLine)
    })  
});

// function to create diff colors for circle markers
// switch, case function doesn't work, this is based on choropleth example:https://leafletjs.com/examples/choropleth/
function getColor(d) {
  return d > 5  ? '#f45f42' :
        d > 4  ? '#f48641' :
        d > 3   ? '#f49a41' :
        d > 2   ? '#f4cd41' :
        d > 1   ? '#f4f141' :
                  '#97f441';
}
// function to get the radius for circle markers
function getRadius(value){
    return value*60000
}
// Define streetmap
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw");
// satelliteMap: has to insert id
var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  id: 'mapbox.satellite',
  accessToken: 'pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw'
});
//  Define light map
var lightMap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw")
// function to make the map with 2 markers
function createMap(earthquake, faultLine){
   var baseMaps = {
    "Outdoor Map": streetmap,
    "Grayscale Map": lightMap,
    "Satelite Map": satelliteMap
  };
// overlay toggle on and off
  var overlayMaps = {
    "Earthquakes": earthquake,
    "Fault Lines": faultLine
    
  };
// create mymap
  var mymap = L.map('map', {
    // center: [40.7128, -74.0060], //nyc coordinate
    maxzoom: 0,
    minZoom: 0,
    layers: [lightMap, faultLine, earthquake],
    scrollWheelZoom: false  //diable scroll and zoom in the map
  }); 
  mymap.setView([40.7128, -74.0060], 3); //nyc coordinates, zoom level 3

// create legend for circle marker colors
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],   
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

  return div;
};

legend.addTo(mymap);
//add layer control to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(mymap);
}

