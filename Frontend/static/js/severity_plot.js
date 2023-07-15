let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"
let wildfireGeojson = "../Data/OutputData/CaliWildfires.geojson"
//console.log(window.location.pathname);

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

tile(wildfireSeverity)

operation(wildfireApi)


let gWildfires = [];
let gWildfiresGrp = L.layerGroup(gWildfires);

function operation(link) {d3.json(link).then(function(data){
    let newData = [];
    let markersNumbers = L.markerClusterGroup();
    let markersHeatMap = L.markerClusterGroup();
    //let heatArrayNumbers = []
    let heatArraySeverity = []
    latArray = []
    lonArray = []
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
        latArray.push(data[i].LATITUDE)
        lonArray.push(data[i].LONGITUDE)
        //console.log(lat, lon, data[i].FIRE_NAME)
        markersNumbers.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME));
        markersHeatMap.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME));

        //heat maps
        //heatArrayNumbers.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FREQUENCY]);
        heatArraySeverity.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FIRE_SIZE]);

        
        if (data[i].FIRE_SIZE_CLASS == "G"){
            gWildfires.push(L.marker([lat, lon], {opacity: 0.8}).bindPopup(`<h3>${data[i].COUNTY}</h3><hr>Burned: ${parseFloat(data[i].FIRE_SIZE)} acres<br>Severity: ${data[i].FIRE_SIZE_CLASS} (highest)<br>Wildfire: ${toTitleCase(data[i].FIRE_NAME)}`).addTo(wildfireSeverity))
        }
    }
    //console.log(data)
    //console.log(latArray)
    //console.log(newData)

    //add to map
    L.heatLayer(heatArraySeverity, {
        radius: 10,
        blur: 1,
        //gradient: { 0.1: 'blue', 10: 'lime', 500: 'red' },
        minOpacity: 0.25,
        max: 0
    }).addTo(wildfireSeverity);
    
    L.control.Legend({
        title: "Display",
        position: "topright",
        opacity: 0.5,
        legends: [{label: "G class wildfires", layers: gWildfires,
                type: "image",
                url: "static/image/fireIcon.svg",
                inactive: false
    }]
    }).addTo(wildfireSeverity)
})};


function toTitleCase(str) {
    return str.replace(/\b\w+/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

