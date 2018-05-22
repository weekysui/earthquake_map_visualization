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
).addTo(myMap);

// earthquake data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquake_url,function(data){
    // console.log(data);
    // create cluster markers group
    var markers = L.markerClusterGroup();
    var feature = data.features;
    for (var i=0,ii=feature.length;i<ii;i++){
        var location = feature[i].geometry;
        if(location){
            var place = feature[i].properties.place;
            var mag = feature[i].properties.mag;
            var date = new Date(feature[i].properties.time);
            // create popup text here, you can't add to bindPopup directly, it will only show the last earthquake popup text for all markers
            // source:https://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-realworld.388.html
            var title = `Place: ${place} <hr> Mag: ${mag}<br> Date: ${date}`;
            // console.log(title)
            var marker = L.marker(new L.LatLng(location.coordinates[1],location.coordinates[0]),{title: title});
            marker.bindPopup(title);
            markers.addLayer(marker);
        }; 
    };  
    myMap.addLayer(markers);
});

