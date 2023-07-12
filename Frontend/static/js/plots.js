let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"

//console.log(new Date(Date.parse("2017-10-13")).toLocaleString())

let wildfireNumbers = L.map("wildfireNumbersPlot", {
    center: [37, -119.42],
    zoom: 5.5, 
    maxZoom: 30
    //layer: layer(heatgroup)
});
let wildfireHeatMap = L.map("wildfireHeatMaps", {
    center: [37, -119.42],
    zoom: 5.5,
    maxZoom: 30
})
let wildfireSeverity = L.map("wildfireSeverityMap", {
    center: [37, -119.42],
    zoom: 5.5,
    maxZoom: 30
})

function tile(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
tile(wildfireNumbers)
tile(wildfireHeatMap)
tile(wildfireSeverity)

operation(wildfireApi)

/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(wildfireNumbers);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(wildfireHeatMap);*/

function operation(link) {d3.json(link).then(function(data){
    let newData = [];
    let markersNumbers = L.markerClusterGroup();
    let markersHeatMap = L.markerClusterGroup();
    let heatArrayNumbers = []
    let heatArraySeverity = []
    for(let i = 0; i < data.length; i++) {
        //convert dates
        let oldRecord = data[i];
        //console.log(oldRecord["DISCOVERY_DATE"].slice(0, 4) - oldRecord["DISCOVERY_DATE"].slice(4, 6)-oldRecord["DISCOVERY_DATE"].slice(6, 8))
        oldRecord["DISCOVERY_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["DISCOVERY_DATE"].slice(0, 4)}- ${oldRecord["DISCOVERY_DATE"].slice(4, 6)}-${oldRecord["DISCOVERY_DATE"].slice(6, 8)}`))
        oldRecord["CONTAIN_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["CONTAIN_DATE"].slice(0, 4)}- ${oldRecord["CONTAIN_DATE"].slice(4, 6)}-${oldRecord["CONTAIN_DATE"].slice(6, 8)}`))
        newData.push(oldRecord);

        //markers
        let lat = data[i].LATITUDE;
        let lon = data[i].LONGITUDE;
        //console.log(lat, lon, data[i].FIRE_NAME)
        markersNumbers.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME));
        markersHeatMap.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME));

        //heat maps
        heatArrayNumbers.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FREQUENCY]);
        heatArraySeverity.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FIRE_SIZE]);
    }
    console.log(data)
    //console.log(newData)

    //add to map
    wildfireNumbers.addLayer(markersNumbers);
    L.heatLayer(heatArrayNumbers, {
        radius: 6,
        blur: 1,
        //gradient: { 0.1: 'blue', 0.2: 'lime', 0.5: 'red' },
        minOpacity: 0.25
    }).addTo(wildfireHeatMap);
    L.heatLayer(heatArraySeverity, {
        radius: 10,
        blur: 1,
        //gradient: { 0.1: 'blue', 10: 'lime', 500: 'red' },
        minOpacity: 0.25,
        max: 0
    }).addTo(wildfireSeverity);

    //let heatOverLyr = {Numbers: markersHeatMap}
    //L.control.layers(null, heatOverLyr).addTo(wildfireHeatMap)
    L.control.Legend({
        title: "  Options",
        position: "topright",
        opacity: 0.5,
        legends: [{label: "Numbers", layers: markersHeatMap,
                type: "image",
                url: "static/image/markerclusterLegend.png",
                inactive: true
    }]
    }).addTo(wildfireHeatMap)

   
})};



/*
function layer(layer){
    temp = []
    temp.push(layer)
    return temp
}
*/

  

