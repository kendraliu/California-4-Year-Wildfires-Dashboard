let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"
let wildfireGeojson = "https://gist.githubusercontent.com/kendraliu/dd030ccc2d3a7490085c5bedc7c904e5/raw/CaliWildfires.geojson"
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
/*
let wildfireSeverity = L.map("wildfireSeverityMap", {
    center: [37, -119.42],
    zoom: 5.5,
    maxZoom: 30
})
let wildfireCause = L.map("wildfireCauseMap", {
    center: [37, -119.42],
    zoom: 5.5,
    maxZoom: 30
})*/

function tile(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
//tile(wildfireNumbers)
tile(wildfireHeatMap)
//tile(wildfireSeverity)
//tile(wildfireCause)

operation(wildfireApi)
cholorplethOp(wildfireGeojson, wildfireHeatMap)

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
        markersHeatMap.addLayer(L.marker([lat, lon]).bindPopup(data[i].FIRE_NAME)).addTo(wildfireHeatMap);

        //heat map
        heatArrayNumbers.push([data[i].LATITUDE, data[i].LONGITUDE, data[i].FREQUENCY]);
    }
    //console.log(data)
    //console.log(latArray)
    //console.log(newData)

    //add to map
    let numberHeatmap = L.heatLayer(heatArrayNumbers, {
        radius: 6,
        blur: 1,
        minOpacity: 0.25
    });

    L.control.Legend({
        title: "Stats",
        position: "topright",
        opacity: 0.5,
        legends: [{label: "Numbers", layers: markersHeatMap,
                type: "image",
                url: "static/image/markerclusterLegend.png",
                inactive: false
    }]
    }).addTo(wildfireHeatMap)

    let heatLegend = L.control({position: 'bottomleft'})
    heatLegend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let limits = geojson.options.limits;
        let colors = ["#8000ff", "#0080ff", "#00ffff", "#00ff80", "#80ff00", "#ffff00", "#ff8000", "#ff0000"];
        let labels = [];
    
        div.innerHTML = "<div class='legend-header'>Number of Wildfires</div>" + 
          '<div class="labels">' +
            '<div class="min">' + limits[0] + '</div>' +
            '<div class="max">' + limits[limits.length - 1] + '</div>' + 
          '</div>' 

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>' 
        return div
    }

    L.control.layers({
        "Statewide": numberHeatmap,
        "By County": geojson
      }, null, {collapsed: false}).addTo(wildfireHeatMap);

      wildfireHeatMap.on("baselayerchange", function(event){
        if (event.layer == numberHeatmap){
          wildfireHeatMap.removeControl(legend)
            heatLegend.addTo(wildfireHeatMap)
            console.log("yes")
        }
        else if (event.layer == geojson){
            legend.addTo(wildfireHeatMap)
            wildfireHeatMap.removeControl(heatLegend)
        }
    })
})};

function cholorplethOp(link, map){d3.json(link).then(function(data){
    console.log(data)
    geojson = L.choropleth(data, {
        valueProperty: 'WILDFIRE_COUNT',
        scale: ['F8E726', '22A087', '430357'],
        steps: 8,
        mode: 'q',
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
      }).addTo(wildfireHeatMap)
      console.log(geojson)
    
    legend = L.control({position: 'bottomleft'})
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];
    
        div.innerHTML = "<div class='legend-header'>Number of Wildfires</div>" + 
          '<div class="labels">' +
            '<div class="min">' + limits[0] + '</div>' +
            '<div class="max">' + limits[limits.length - 1] + '</div>' + 
          '</div>' 
        
        limits.forEach(function (limit, index) {
          labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })
        div.innerHTML += '<ul>' + labels.join('') + '</ul>' 
        return div
    }
    legend.addTo(map)
    //console.log(div.innerHTML)


    //hovering over contents
    let info = L.control();

    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = (props ?
            '<h3>' + props.CountyName + ' County</h3><hr>' +
            '' + props.WILDFIRE_COUNT + ' wildfires (2017-2020)'
        : '<img src="static/image/icon.png" style="width: 30px; height: 30px;"">' + '  2017-2020 Wildfires');
    };

    info.addTo(map);
    
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
      }

    }
)}


function toTitleCase(str) {
    return str.replace(/\b\w+/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

