// Function to extract the month from the DISCOVERY_DATE field
function getMonthFromDiscoveryDate(discoveryDate) {
    var month = discoveryDate.substring(4, 6);
    return parseInt(month);
  }
  // Function to create the Plotly bar graph
  function createBarGraph(months, numWildfire) {
    var data = [{
      x: months,
      y: numWildfire,
      type: 'bar'
    }];
    var layout = {
      title: 'Number of Wildfires per Month',
      xaxis: {
        title: 'Month'
      },
      yaxis: {
        title: 'Number of Wildfires'
      }
    };
    Plotly.newPlot('totalNumBarGraph', data, layout);
  }
  // Fetch data from the API and create the bar graph
  fetch('http://127.0.0.1:5000/api/cawildfires17-20')
    .then(response => response.json())
    .then(data => {
      // Calculate the number of wildfires per month
      var monthData = {};
      data.forEach(row => {
        var month = getMonthFromDiscoveryDate(row.DISCOVERY_DATE);
        if (!monthData[month]) {
          monthData[month] = 1;
        } else {
          monthData[month]++;
        }
      });
      var months = Object.keys(monthData);
      var numWildfire = Object.values(monthData);
      createBarGraph(months, numWildfire);
    })
    .catch(error => console.error(error));