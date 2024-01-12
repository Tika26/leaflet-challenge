//Store URL link for GeeJson
let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Create a map object
let map = L.map("map", {
    center: [0,-20],
    zoom: 2
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Perform a GET request to URL
d3.json(URL).then(function (data) {
    console.log(data.features[0]);

    L.geoJSON(data, {
        
        style: function (feature) {
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];

            return {
                color: "black",
                weight: 1,
                radius: mag * 2,
                fillOpacity: 0.8,
                fillColor: 
                    depth > 90 ? "red" :
                    depth > 70 ? "purple" :
                    depth > 50 ? "orange" :
                    depth > 30 ? "yellow" :
                    depth > 10 ? "lime" : "green"
            };      
        },
        pointToLayer: function(data, latlng) {
            return L.circleMarker(latlng);
        }
    }).bindPopup(function (layer) {
        let mag = layer.feature.properties.mag;
        let place = layer.feature.properties.place;
        let time = new Date(layer.feature.properties.time).toLocaleString();
        
        
        return `<h3>${place}<br>Magnitude: ${mag}<br>${time}</h3>`
    }).addTo(map);
});

let legend = L.control({position:'bottomright'});

legend.onAdd = function (){
    let div = L.DomUtil.create('div', 'legend');

    div.innerHTML = `
        <div style="background:green;">-10 - 10</div>
        <div style="background:lime;">10 - 30</div>
        <div style="background:yellow;">30 - 50</div>
        <div style="background:orange;">50 - 70</div>
        <div style="background:purple;">70 - 90</div>
        <div style="background:red;">90+</div>
    `;

    return div
}

legend.addTo(map);


