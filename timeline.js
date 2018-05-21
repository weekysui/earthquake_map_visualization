// Define streetmap
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw")
// satelliteMap: has to insert id
var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  id: 'mapbox.satellite',
  accessToken: 'pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw'
});
//  Define light map
var lightMap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw")

// earthquake data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// fault lines data url
var boundary_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// get data from earthquake url:
d3.json(earthquake_url,function(data){
   console.log(data)
// add timeline layer, refer from:
// https://gis.stackexchange.com/questions/262518/leaflet-timeline-plugin-issue
   var timelineLayer = L.timeline(data,{
       getInterval: function(feature){
           return { //start time and end time tells when it starts, and when it ends for each earthquake
            //    find the time from earthquake data
               start:feature.properties.time,
            //    since no data says it's end time, end + some value based on magnitude
            //    1800000 = 30 minutes, so a earthquake of manitude 5 would show on the map for 150 minutes or 2.5 hours
               end: feature.properties.time+feature.properties.mag*1800000   // the higher the mag, the longer of time the circle will stay on the map. 
           };
       },
       pointToLayer: function (feature, latlng) {
        return new L.circle(latlng, 
            {radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            fillOpacity: .75,
            color: "white",
            weight: 1
        })
      }
   })
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
        createMap(timelineLayer,faultLine)
    })  
    
})
// function to get circle markers color. 
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
      return value*100000
  }
function createMap(timelineLayer,faultLine){
    var baseMaps = {
        "Outdoor Map": streetmap,
        "Grayscale Map": lightMap,
        "Satelite Map": satelliteMap
    };

    var overlayMaps = {
        "Fault Lines":faultLine,
        "Time Line Slides":timelineLayer
    };
    // create mymap
    var mymap = L.map('map', {
        // center: [40.7128, -74.0060], //nyc coordinate
        maxzoom: 0,
        minZoom: 0,
        layers: [lightMap, faultLine,timelineLayer],
        maxBounds: [[90,-180],[-90,180]],
        scrollWheelZoom: false  //diable scroll and zoom in the map

    }); 
    mymap.setView([40.7128, -74.0060], 3); //nyc coordinates, zoom level 3
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
  var timelineControl = L.timelineSliderControl({
    formatOutput: function(data){
        return new Date(data)
    },
    duration:100000,
    // position is bottom left by default
}).addTo(mymap)
timelineControl.addTimelines(timelineLayer)
}

// timelineLayer.addTo(mymap)

