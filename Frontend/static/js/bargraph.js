// plot.js

// Function to create the Plotly bar graph
function createBarGraph(data) {
  var countyYearMap = {};

  // Process the data and count the wildfires per county and year
  data.forEach(row => {
    var county = row.COUNTY;
    var year = row.FIRE_YEAR;

    if (!countyYearMap[county]) {
      countyYearMap[county] = {};
    }

    if (!countyYearMap[county][year]) {
      countyYearMap[county][year] = 0;
    }

    countyYearMap[county][year]++;
  });

  var counties = Object.keys(countyYearMap);
  var years = [...new Set(data.map(row => row.FIRE_YEAR))];
  var numWildfires = [];

  // Build the numWildfires array based on the county-year mapping
  counties.forEach(county => {
    var wildfiresPerYear = [];
    years.forEach(year => {
      var count = countyYearMap[county][year] || 0;
      wildfiresPerYear.push(count);
    });
    numWildfires.push(wildfiresPerYear);
  });

  var data = [];
  
  for (var i = 0; i < years.length; i++) {
    var bar = {
      x: counties,
      y: numWildfires.map(row => row[i]),
      type: 'bar',
      name: years[i].toString()
    };
    
    data.push(bar);
  }

  var layout = {
    title: 'Number of Wildfires in Each County for Each Year',
    xaxis: {
      title: 'County'
    },
    yaxis: {
      title: 'Number of Wildfires'
    }
  };

  Plotly.newPlot('barGraphDetailed', data, layout);
}

// Fetch data from the API and create the bar graph
fetch('http://127.0.0.1:5000/api/cawildfires17-20')
  .then(response => response.json())
  .then(data => {
    createBarGraph(data);
  })
  .catch(error => console.error(error));

    
  
  d3.json(wildfireGeojson).then(function(data){
    console.log(data)
  })