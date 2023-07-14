import pandas from 'pandas-js';
import plotly from 'plotly.js-dist';

// Get the current working directory
const cwd = process.cwd();
console.log(cwd);

// Read the data from the "WildfiresDB" database file
const wildfires_data = pandas.read_sql_table("fire_data", engine);

// Calculate the average number of wildfires per county
const avg_wildfires_per_county = wildfires_data.groupby('COUNTY').size().mean();
console.log("Average wildfires per county:", avg_wildfires_per_county);

// Sort the data by county in alphabetical order
const most_severe_wildfires = wildfires_data[wildfires_data['FIRE_SIZE_CLASS'] === 'G'].sort_values('COUNTY');

// Create a bar graph for the most severe wildfires (Fire Size Class 'G') and average acres burned
const data = [
  {
    x: most_severe_wildfires['COUNTY'],
    y: most_severe_wildfires['FIRE_SIZE'],
    type: 'bar',
    xaxis: 'x',
    yaxis: 'y',
    marker: { color: 'blue' },
    hovertemplate: '%{x}: %{y}',
  }
];
const layout = {
  xaxis: { title: 'County' },
  yaxis: { title: 'Fire Size' },
  title: 'Most Severe Wildfires (Fire Size Class G)',
};
plotly.newPlot('chart', data, layout);

// Calculate the average acres burned for severe wildfires
const avg_acres_burned = most_severe_wildfires['FIRE_SIZE'].mean();
console.log("Average acres burned for severe wildfires:", avg_acres_burned);

