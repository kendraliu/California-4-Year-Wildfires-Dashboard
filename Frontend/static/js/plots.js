let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"
let wildfireGeojson = "../Data/OutputData/CaliWildfires.geojson"
//console.log(window.location.pathname);

//console.log(new Date(Date.parse("2017-10-13")).toLocaleString())
/*
let wildfireNumbers = L.map("wildfireNumbersPlot", {
    center: [37, -119.42],
    zoom: 5.5, 
    maxZoom: 30
    //layer: layer(heatgroup)
});*/
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
let wildfireCause = L.map("wildfireCauseMap", {
    center: [37, -119.42],
    zoom: 5.5,
    maxZoom: 30
})

function tile(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
//tile(wildfireNumbers)
tile(wildfireHeatMap)
tile(wildfireSeverity)
tile(wildfireCause)

operation(wildfireApi)
cholorplethOp(wildfireGeojson)

let gWildfires = [];
let gWildfiresGrp = L.layerGroup(gWildfires);

function operation(link) {d3.json(link).then(function(data){
    let newData = [];
    let markersNumbers = L.markerClusterGroup();
    let markersHeatMap = L.markerClusterGroup();
    let heatArrayNumbers = []
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
        heatArrayNumbers.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FREQUENCY]);
        heatArraySeverity.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FIRE_SIZE]);

        
        if (data[i].FIRE_SIZE_CLASS == "G"){
            gWildfires.push(L.marker([lat, lon], {opacity: 0.8}).bindPopup(`${data[i].COUNTY}<hr>Burned: ${parseFloat(data[i].FIRE_SIZE)} acres<br>Severity: ${data[i].FIRE_SIZE_CLASS} (highest)<br>Wildfire: ${toTitleCase(data[i].FIRE_NAME)}`).addTo(wildfireSeverity))
        }
    }
    //console.log(data)
    //console.log(latArray)
    //console.log(newData)

    //add to map
    
    //wildfireNumbers.addLayer(markersNumbers);
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
        title: "Display",
        position: "topright",
        opacity: 0.5,
        legends: [{label: "Numbers", layers: markersHeatMap,
                type: "image",
                url: "static/image/markerclusterLegend.png",
                inactive: true
    }]
    }).addTo(wildfireHeatMap)
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


function cholorplethOp(link){d3.json(link).then(function(data){
    console.log(data)
    let geojson = L.choropleth(data, {
        valueProperty: 'HUMAN/NATURAL',
        scale: ['yellow', 'maroon'], // chroma.js scale - include as many as you like
        steps: 5, // number of breaks or steps in range
        mode: 'q', // q for quantile, e for equidistant, k for k-means
        style: {
          color: '#fff', // border color
          weight: 2,
          fillOpacity: 0.8
        },
        onEachFeature: function(feature, layer) {  //optional pop-up //the feature here is essential data.features.feature.properties.NAME
          layer.bindPopup(`Wildfires caused by human: ${feature.properties.CAUSED_BY_HUMAN}<br>Wildfires occurred natuarally: ${feature.properties.NATURAL_WILDFIRE}`)
        }
      }).addTo(wildfireCause)
      //console.log(geojson) //the geojson, the whole thing, is the red gradient blocked map
    
      let legend = L.control({position: 'bottomright'}) //create legend
      legend.onAdd = function () { //this whole thing (ie. the function) is just an html string/code, = legend.onAdd // add it to the legend we created
        let div = L.DomUtil.create('div', 'info legend');
        let limits = geojson.options.limits; //use properties of that colored map we created
        let colors = geojson.options.colors;
        let labels = [];
    
        div.innerHTML = "<div class='centered-text'>" +
            "<p>% Human Caused Wildfires</p>" + 
          "</div>" + 
          '<div class="labels">' +
            '<div class="min">Least</div>' +
                '<div class="max">Most</div>' + 
          '</div>' // Add min & max to the div's innerHTML attribute/property
        
        limits.forEach(function (limit, index) {
          labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })
        div.innerHTML += '<ul>' + labels.join('') + '</ul>' // update div.innerHTML to include an unordered list (<ul>) of all items in labels[] with no space in between items (.join(""))
        return div
      }
      legend.addTo(wildfireCause)
      //console.log(div.innerHTML)
    }
)}


function toTitleCase(str) {
    return str.replace(/\b\w+/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }


// Import required modules
const { createEngine } = require("sqlalchemy");
const pandas = require("pandas-js");
const plotly = require("plotly.js-dist");
// Get the current working directory
const cwd = process.cwd();
console.log(cwd);
// Create the SQLAlchemy engine
const engine = createEngine("sqlite:///Backend/WildfiresDB.db");
// Read the data from the "WildfiresDB" database file
const wildfires_data = pandas.read_sql_table("fire_data", engine);
// Calculate the average number of wildfires per county
const avg_wildfires_per_county = wildfires_data.groupby('COUNTY').size().mean();
console.log("Average wildfires per county:", avg_wildfires_per_county);
// Sort the data by county in alphabetical order
const most_severe_wildfires = wildfires_data[wildfires_data['FIRE_SIZE_CLASS'] === 'G'].sort_values('COUNTY');
// Create a bar graph for the most severe wildfires (Fire Size Class 'G') and average acres burned
const data = [
  {
    x: most_severe_wildfires['COUNTY'],
    y: most_severe_wildfires['FIRE_SIZE'],
    type: 'bar',
    xaxis: 'x',
    yaxis: 'y',
    marker: { color: 'blue' },
    hovertemplate: '%{x}: %{y}',
  }
];
const layout = {
  xaxis: { title: 'County' },
  yaxis: { title: 'Fire Size' },
  title: 'Most Severe Wildfires (Fire Size Class G)',
};
plotly.newPlot('chart', data, layout);
// Calculate the average acres burned for severe wildfires
const avg_acres_burned = most_severe_wildfires['FIRE_SIZE'].mean();
console.log("Average acres burned for severe wildfires:", avg_acres_burned);