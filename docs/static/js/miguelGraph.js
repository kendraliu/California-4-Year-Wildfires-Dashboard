// Function to create the Plotly bar graph
function createBarGraph(counties, fireSizes) {
    var data = [{
      x: counties,
      y: fireSizes,
      type: 'bar'
    }];
    var layout = {
      title: 'Most Severe Wildfires (Fire Size Class G) by County',
      xaxis: {
        title: 'County'
      },
      yaxis: {
        title: 'Fire Size'
      }
    };
    Plotly.newPlot('barGraph', data, layout);
  }
  // Fetch data from the API and create the bar graph
  fetch('http://127.0.0.1:5000/api/cawildfires17-20')
    .then(response => response.json())
    .then(data => {
      // Filter data for Fire Size Class G
      var filteredData = data.filter(row => row.FIRE_SIZE_CLASS === 'G');
      // Extract counties and fire sizes
      var counties = filteredData.map(row => row.COUNTY);
      var fireSizes = filteredData.map(row => row.FIRE_SIZE);
      createBarGraph(counties, fireSizes);
    })
    .catch(error => console.error(error));