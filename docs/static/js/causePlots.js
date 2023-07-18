let wildfireApi = "http://127.0.0.1:5000/api/cawildfires17-20"
let wildfireGeojson = "https://gist.githubusercontent.com/kendraliu/dd030ccc2d3a7490085c5bedc7c904e5/raw/CaliWildfires.geojson"

let wildfireCause = L.map("wildfireCauseMap", {
    center: [37, -118.3],
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
cholorplethOp(wildfireGeojson, wildfireCause)

//choropleth maps
function cholorplethOp(link, map){d3.json(link).then(function(data){
    console.log(data)
    let geojson = L.choropleth(data, {
        valueProperty: 'HUMAN/NATURAL',
        scale: ['F2F322', 'D25170', '120789'],
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
      }).addTo(map)
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
    legend.addTo(map)

    //hovering over contents
    let info = L.control();

    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = (props ?
            '<h3>' + props.CountyName + ' County</h3><hr>' +
            'Wildfires caused by human: ' + props.CAUSED_BY_HUMAN + '<br />Wildfires occurred natuarally: ' + props.NATURAL_WILDFIRE
        : '<img src="static/image/icon.png" style="width: 30px; height: 30px;"">' + "   Caused by humans?");
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

