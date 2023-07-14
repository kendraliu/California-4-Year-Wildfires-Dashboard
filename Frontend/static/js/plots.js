//const os = require('os');
const { createEngine } = require('sqlalchemy');
const pandas = require('pandas-js');
const plotly = require('plotly.js-dist');
//const cwd = os.cwd();
//console.log(cwd);
const engine = createEngine('sqlite:///Backend/WildfiresDB.db');
const wildfires_data = pandas.read_sql_table('fire_data', engine);
const avg_wildfires_per_county = wildfires_data.groupby('COUNTY').size().mean();
console.log('Average wildfires per county:', avg_wildfires_per_county);
const most_severe_wildfires = wildfires_data[wildfires_data['FIRE_SIZE_CLASS'] === 'G'].sort_values('COUNTY');
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
const avg_acres_burned = most_severe_wildfires['FIRE_SIZE'].mean();
console.log('Average acres burned for severe wildfires:', avg_acres_burned);