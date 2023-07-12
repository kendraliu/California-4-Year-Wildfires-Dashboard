let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"

//console.log(new Date(Date.parse("2017-10-13")).toLocaleString())

d3.json(wildfireApi).then(function(data){
    let newData = [];
    let markers = L.markerClusterGroup();
    for(let i = 0; i < data.length; i++) {
        //convert dates
        let oldRecord = data[i];
        //console.log(oldRecord["DISCOVERY_DATE"].slice(0, 4) - oldRecord["DISCOVERY_DATE"].slice(4, 6)-oldRecord["DISCOVERY_DATE"].slice(6, 8))
        oldRecord["DISCOVERY_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["DISCOVERY_DATE"].slice(0, 4)}- ${oldRecord["DISCOVERY_DATE"].slice(4, 6)}-${oldRecord["DISCOVERY_DATE"].slice(6, 8)}`))
        oldRecord["CONTAIN_DATE_FORMATTED"] = new Date(Date.parse(`${oldRecord["CONTAIN_DATE"].slice(0, 4)}- ${oldRecord["CONTAIN_DATE"].slice(4, 6)}-${oldRecord["CONTAIN_DATE"].slice(6, 8)}`))
        newData.push(oldRecord);

        //markers
        let lon = data[i].LONGITUDE;
        let lat = data[i].LATITUDE;
        console.log(lat, lon, data[i].FIRE_NAME)
        markers.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME));
        //markers.addLayer(L.marker( [Number(lat), Number(lon)]));
    }
    console.log(data)
    //console.log(newData)
    
    wildfireNumbers.addLayer(markers);
});

let wildfireNumbers = L.map("map", {
    center: [32.78, -117.42],
    zoom: 5.5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(wildfireNumbers);
  

