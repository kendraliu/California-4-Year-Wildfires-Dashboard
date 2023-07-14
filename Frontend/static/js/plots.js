// Function to create the Plotly bar graph
function createBarGraph(data) {
  const countyYearMap = {};

  // Process the data and count the wildfires per county and year
  data.forEach(row => {
    const county = row.COUNTY;
    const year = row.FIRE_YEAR;

    if (!countyYearMap[county]) {
      countyYearMap[county] = {};
    }

    if (!countyYearMap[county][year]) {
      countyYearMap[county][year] = 0;
    }

    countyYearMap[county][year]++;
  });

  const counties = Object.keys(countyYearMap);
  const years = [...new Set(data.map(row => row.FIRE_YEAR))];
  const numWildfires = [];

  // Build the numWildfires array based on the county-year mapping
  counties.forEach(county => {
    const wildfiresPerYear = [];
    years.forEach(year => {
      const count = countyYearMap[county][year] || 0;
      wildfiresPerYear.push(count);
    });
    numWildfires.push(wildfiresPerYear);
  });

  const plotData = [];
  
  for (let i = 0; i < years.length; i++) {
    const bar = {
      x: counties,
      y: numWildfires.map(row => row[i]),
      type: 'bar',
      name: years[i].toString()
    };
    
    plotData.push(bar);
  }

  const layout = {
    title: 'Number of Wildfires in Each County for Each Year',
    xaxis: {
      title: 'County'
    },
    yaxis: {
      title: 'Number of Wildfires'
    }
  };

  Plotly.newPlot('barGraph', plotData, layout);
}

// Fetch data from the API and create the bar graph
fetch('http://127.0.0.1:5000/api/cawildfires17-20')
  .then(response => response.json())
  .then(data => {
    createBarGraph(data);
  })
  .catch(error => console.error(error));

const wildfireGeojson = '../../Data/OutputData/CaliWildfires.geojson';
d3.json(wildfireGeojson).then(function(data) {
  console.log(data);
});

