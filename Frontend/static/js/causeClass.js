// Function to create the Plotly pie chart
function createPieChart(causeClassifications, counts) {
    var data = [{
      labels: causeClassifications,
      values: counts,
      type: 'pie'
    }];
    var layout = {
      title: 'Cause Classification of Wildfires',
    };
    Plotly.newPlot('pieChart', data, layout);
  }
  // Fetch data from the API and create the pie chart
  fetch('http://127.0.0.1:5000/api/cawildfires17-20')
    .then(response => response.json())
    .then(data => {
      // Calculate the count for each cause classification
      var causeClassData = {};
      data.forEach(row => {
        if (causeClassData[row.CAUSE_CLASSIFICATION]) {
          causeClassData[row.CAUSE_CLASSIFICATION]++;
        } else {
          causeClassData[row.CAUSE_CLASSIFICATION] = 1;
        }
      });
      var causeClassifications = Object.keys(causeClassData);
      var counts = Object.values(causeClassData);
      createPieChart(causeClassifications, counts);
    })
    .catch(error => console.error(error));