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

tile(wildfireCause)

//operation(wildfireApi)
cholorplethOp(wildfireGeojson)

let gWildfires = [];
let gWildfiresGrp = L.layerGroup(gWildfires);
/*
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
            gWildfires.push(L.marker([lat, lon], {opacity: 0.8}).bindPopup(`<h3>${data[i].COUNTY}</h3><hr>Burned: ${parseFloat(data[i].FIRE_SIZE)} acres<br>Severity: ${data[i].FIRE_SIZE_CLASS} (highest)<br>Wildfire: ${toTitleCase(data[i].FIRE_NAME)}`).addTo(wildfireSeverity))
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
*/
//choropleth maps
function cholorplethOp(link){d3.json(link).then(function(data){
    console.log(data)
    let geojson = L.choropleth(data, {
        valueProperty: 'HUMAN/NATURAL',
        scale: ['FFEDA0', 'red'],
        steps: 8,
        mode: 'q', // q for quantile, e for equidistant, k for k-means
        style: {
          color: '#fff', // border color
          weight: 2,
          fillOpacity: 0.8,
          dashArray: '3',
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
            })
          //layer.bindPopup(`<h3>${feature.properties.CountyName} County</h3><hr>Wildfires caused by human: ${feature.properties.CAUSED_BY_HUMAN}<br>Wildfires occurred natuarally: ${feature.properties.NATURAL_WILDFIRE}`)
        }
      }).addTo(wildfireCause)
      //console.log(geojson)
    
    let legend = L.control({position: 'bottomleft'})
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];
    
        div.innerHTML = "<div class='legend-header'>% Human Caused Wildfires</div>" + 
          '<div class="labels">' +
            '<div class="min">Least</div>' +
                '<div class="max">Most</div>' + 
          '</div>' 
        
        limits.forEach(function (limit, index) {
          labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })
        div.innerHTML += '<ul>' + labels.join('') + '</ul>' 
        return div
    }
    legend.addTo(wildfireCause)
    //console.log(div.innerHTML)

    let info = L.control();

    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = (props ?
            '<h3>' + props.CountyName + ' County</h3><hr>' +
            'Wildfires caused by human: ' + props.CAUSED_BY_HUMAN + '<br />Wildfires occurred natuarally: ' + props.NATURAL_WILDFIRE
        : '<img src="static/image/icon.png" style="width: 30px; height: 30px;"">');
    };

    info.addTo(wildfireCause);
    
    //hovering events
    function highlightFeature(event) {
        let layer = event.target;
        layer.setStyle({
            weight: 6,
            color: '#b01f15',
            dashArray: '',
            fillOpacity: 0.7
        });
        layer.bringToFront();
        info.update(layer.feature.properties);
      }

    function resetHighlight(event) {
        geojson.resetStyle(event.target);
        info.update();
        isMouseOver = false;
      }

    }
)}


function toTitleCase(str) {
    return str.replace(/\b\w+/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
