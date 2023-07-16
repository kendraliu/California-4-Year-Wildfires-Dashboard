// Function to create the Plotly pie chart
function createPieChart(counties, averages) {
  var data = [{
    labels: counties,
    values: averages,
    type: 'pie'
  }];
  var layout = {
    title: 'Average Wildfires per County',
  };
  Plotly.newPlot('pieChart', data, layout);
}
// Fetch data from the API and create the pie chart
fetch('http://127.0.0.1:5000/api/cawildfires17-20')
  .then(response => response.json())
  .then(data => {
    // Calculate average wildfires per county
    var countyData = {};
    data.forEach(row => {
      if (countyData[row.COUNTY]) {
        countyData[row.COUNTY].count++;
      } else {
        countyData[row.COUNTY] = { count: 1 };
      }
    });
    var counties = Object.keys(countyData);
    var averages = counties.map(county => countyData[county].count);
    createPieChart(counties, averages);
  })
  .catch(error => console.error(error));