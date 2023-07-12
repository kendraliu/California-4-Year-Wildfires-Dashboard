let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"

//console.log(new Date(Date.parse("2017-10-13")).toLocaleString())

let wildfireNumbers = L.map("wildfireNumbersPlot", {
    center: [37, -119.42],
    zoom: 5.5, 
    maxZoom: 30
});

let wildfireHeatMap = L.map("wildfireHeatMaps", {
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
/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(wildfireNumbers);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(wildfireHeatMap);*/

d3.json(wildfireApi).then(function(data){
    let newData = [];
    let markers = L.markerClusterGroup();
    let heatArray = []
    for(let i = 0; i < data.length; i++) {
        //convert dates
        let oldRecord = data[i];
        //console.log(oldRecord["DISCOVERY_DATE"].slice(0, 4) - oldRecord["DISCOVERY_DATE"].slice(4, 6)-oldRecord["DISCOVERY_DATE"].slice(6, 8))
        oldRecord["DISCOVERY_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["DISCOVERY_DATE"].slice(0, 4)}- ${oldRecord["DISCOVERY_DATE"].slice(4, 6)}-${oldRecord["DISCOVERY_DATE"].slice(6, 8)}`))
        oldRecord["CONTAIN_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["CONTAIN_DATE"].slice(0, 4)}- ${oldRecord["CONTAIN_DATE"].slice(4, 6)}-${oldRecord["CONTAIN_DATE"].slice(6, 8)}`))
        newData.push(oldRecord);

        //1st plot markers
        let lat = data[i].LATITUDE;
        let lon = data[i].LONGITUDE;
        //console.log(lat, lon, data[i].FIRE_NAME)
        markers.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME));

        //2nd plot heat map
        heatArray.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FREQUENCY]);
    }
    //console.log(data)
    //console.log(newData)
    wildfireNumbers.addLayer(markers);
    L.heatLayer(heatArray, {
        radius: 5,
        blur: 1,
        //gradient: { 0.1: 'blue', 0.2: 'lime', 0.5: 'red' },
        minOpacity: 0.25
      }).addTo(wildfireHeatMap);
});


  

