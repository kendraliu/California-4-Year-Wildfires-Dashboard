// Function to create the Plotly bar graph
function createBarGraph(counties, numWildfires) {
    var data = [{
      x: counties,
      y: numWildfires,
      type: 'bar'
    }];
    var layout = {
      title: 'Number of Wildfires per Year for Each County',
      xaxis: {
        title: 'County'
      },
      yaxis: {
        title: 'Number of Wildfires'
      }
    };
    Plotly.newPlot('barGraph', data, layout);
  }
  // Fetch data from the API and create the bar graph
  fetch('http://127.0.0.1:5000/api/cawildfires17-20')
    .then(response => response.json())
    .then(data => {
      // Calculate the number of wildfires per year for each county
      var countyData = {};
      data.forEach(row => {
        var county = row.COUNTY;
        var year = row.FIRE_YEAR;
        if (!countyData[county]) {
          countyData[county] = {};
        }
        if (countyData[county][year]) {
          countyData[county][year]++;
        } else {
          countyData[county][year] = 1;
        }
      });
      var counties = Object.keys(countyData);
      var numWildfires = counties.map(county => Object.values(countyData[county]));
      createBarGraph(counties, numWildfires);
    })
    .catch(error => console.error(error));