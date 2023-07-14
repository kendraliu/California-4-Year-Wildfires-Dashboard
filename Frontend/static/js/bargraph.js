// plot.js

// Function to create the Plotly bar graph
function createBarGraph(years, numWildfires) {
    var data = [{
      x: years,
      y: numWildfires,
      type: 'bar'
    }];
  
    var layout = {
      title: 'Number of Wildfires in Each County for Each Year',
      xaxis: {
        title: 'Year'
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
      
      var years = data.map(row => row.FIRE_YEAR);
      var numWildfires = data.map(row => row.num_wildfires);
      console.log(years)
      console.log("this is num wildfires ")
      console.log(numWildfires)
      createBarGraph(years, numWildfires);
    })
    .catch(error => console.error(error));
  
    
