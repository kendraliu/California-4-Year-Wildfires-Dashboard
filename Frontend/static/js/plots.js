//let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"

//console.log(navigator.userAgent);
//console.log(new Date(Date.parse("2017-10-13")).toLocaleString())

/*
d3.json(wildfireApi).then(function(data){
    let newData = [];
    let markers = L.markerClusterGroup();
    for(let i = 0; i < data.length; i++) {
        let oldRecord = data[i];
        //console.log(oldRecord["DISCOVERY_DATE"].slice(0, 4) - oldRecord["DISCOVERY_DATE"].slice(4, 6)-oldRecord["DISCOVERY_DATE"].slice(6, 8))
        oldRecord["DISCOVERY_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["DISCOVERY_DATE"].slice(0, 4)}- ${oldRecord["DISCOVERY_DATE"].slice(4, 6)}-${oldRecord["DISCOVERY_DATE"].slice(6, 8)}`))
        oldRecord["CONTAIN_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["CONTAIN_DATE"].slice(0, 4)}- ${oldRecord["CONTAIN_DATE"].slice(4, 6)}-${oldRecord["CONTAIN_DATE"].slice(6, 8)}`))
        newData.push(oldRecord);

        let lon = data[i].LONGITUDE;
        let lat = data[i].LATITUDE;
        if (lon && lat) {
            markers.addLayer(L.marker([lon, lat]).bindPopup(data[i].FIRE_NAME));
        }
    }
    //console.log(newData)
    
    myMap.addLayer(markers);

});*/

let myMap = L.map("map", {
    center: [36.78, 119.42],
    zoom: 11
});
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

