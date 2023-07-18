// Function to create the Plotly pie chart
function createPieChart(causes, counts) {
    var data = [{
      labels: causes,
      values: counts,
      type: 'pie'
    }];
    var layout = {
      title: 'Cause of Wildfires',
    };
    Plotly.newPlot('pieChart', data, layout);
  }
  // Fetch data from the API and create the pie chart
  fetch('http://127.0.0.1:5000/api/cawildfires17-20')
    .then(response => response.json())
    .then(data => {
      // Calculate the count for each cause
      var causeData = {};
      data.forEach(row => {
        if (causeData[row.CAUSE]) {
          causeData[row.CAUSE]++;
        } else {
          causeData[row.CAUSE] = 1;
        }
      });
      var causes = Object.keys(causeData);
      var counts = Object.values(causeData);
      createPieChart(causes, counts);
    })
    .catch(error => console.error(error));