// create my map
var myMap = L.map("map",{
    maxzoom: 0,
    minZoom: 0,
    scrollWheelZoom: false  //diable scroll and zoom in the map
}); 
myMap.setView([40.7128, -74.0060], 2); //nyc coordinates, zoom level 2

var tiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw").addTo(myMap);

// earthquake data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(earthquake_url,function(data){
    // console.log(data);
    var heatArray = []
    var feature = data.features;
    for (var i=0,ii=feature.length;i<ii;i++){
        var location = feature[i].geometry;
        if(location){
            heatArray.push([location.coordinates[1],location.coordinates[0]]);
        }; 
    }; 
    var heat = L.heatLayer(heatArray, {
        radius:20,
        minOpacity:0.8  
    }).addTo(myMap); 
});