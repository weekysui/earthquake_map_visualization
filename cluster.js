// create my map
var myMap = L.map("map",{
    maxzoom: 0,
    minZoom: 0,
    scrollWheelZoom: false  //diable scroll and zoom in the map
}); 
myMap.setView([40.7128, -74.0060], 1); //nyc coordinates, zoom level 1
// create tilelayer 
L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw"
).addTo(myMap)

// earthquake data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(earthquake_url,function(data){
    console.log(data);
    // create cluster markers
    var markers = L.markerClusterGroup();
    var feature = data.features;
    for (var i=0,ii=feature.length;i<ii;i++){
        var location = feature[i].geometry;
        if(location){
            markers.addLayer(L.marker([location.coordinates[1],location.coordinates[0]]))
                .bindPopup(`${feature[i].properties.place} <hr> Magnitude: ${feature[i].properties.mag} <br> Date: ${new Date(feature[i].properties.time)}`)
        } 
    }  
    myMap.addLayer(markers)
})

