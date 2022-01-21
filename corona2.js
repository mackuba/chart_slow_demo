const colorSet = [
  '#ff4322', '#06a1fe', '#198038', '#c24885', '#60d835',
  '#6929c4', '#f8bb03', '#5f5f60', '#bd5a05', '#002d9c',
  'darkCyan', '#6c703a', '#8a2319', '#888', '#ff9900',
  '#94bada', 'pink', '#00e0e0', '#c0e000', 'black'
];

const population = { "UK": 67886011, "France": 65273511, "Italy": 60461826, "Germany": 83783942, "Spain": 46754778, "Poland": 37846611, "Ukraine": 43733762, "Netherlands": 17134872, "Czechia": 10708981, "Belgium": 11589623, "USA": 331002651, "India": 1380004385, "Turkey": 84339067, "Russia": 145934462, "Brazil": 212559417, "Peru": 32971854, "Mexico": 128932753, "Indonesia": 273523615, "Iran": 83992949, "Colombia": 50882891 }

function initChart() {
  window.timestamps = window.coronaData.dates.map(date => {
    let fields = date.split('/').map(x => parseInt(x, 10));
    let dateObject = new Date(2000 + fields[2], fields[0] - 1, fields[1]);
    return dateObject.getTime();
  });

  let countries = Object.keys(population);
  let datasets = countries.map((c, i) => datasetForCountry(c, i, window.coronaData.places[c]));
  let options = chartOptions(window.byPopulation ? "Daily Covid deaths per 1 mln" : "Daily Covid deaths");

  let canvas = document.getElementById('corona_chart');

  window.chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      datasets: datasets
    },
    options: options
  });
}

function changeByPopulation() {
  let checkbox = document.getElementById('by_population');
  window.byPopulation = checkbox.checked;
  reloadChart();
}

function reloadChart() {
  let chart = window.chart;

  let countries = Object.keys(population);
  chart.data.datasets = countries.map((c, i) => datasetForCountry(c, i, window.coronaData.places[c]));
  chart.options = chartOptions(window.byPopulation ? "Daily Covid deaths per 1 mln" : "Daily Covid deaths");

  chart.update();
}

function datasetForCountry(country, index, json) {
  let values;

  if (window.byPopulation) {
    let pop = population[country] / 1_000_000;
    values = json.map(x => x ? x / pop : x);
  } else {
    values = json;
  }

  return {
    label: country,
    fill: false,
    data: values.map((n, i) => ({ x: window.timestamps[i], y: n })).filter(d => d.y !== null && d.y !== undefined),
    borderColor: colorSet[index],
    pointBackgroundColor: colorSet[index],
    pointRadius: 2.75
  };
}

function formatDate(date) {
  let fields = date.split('/');
  return fields[0] + '/' + fields[1];
}

function chartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600
    },
    title: {
      display: true,
      text: `${title} [v2 timeobj]`,
      fontSize: 20,
      fontColor: '#333',
      fontStyle: 'normal',
      padding: 20
    },
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 14
      }
    },
    elements: {
      point: {
        radius: 2.5
      },
      line: {
        borderJoinStyle: 'round',
        borderWidth: 2.75,
        tension: 0
      },
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month',
          parser: 'M/d/yy',
          displayFormats: {
            month: 'MMM',
          }
        },
        ticks: {
          fontSize: 13,
          callback: function(v) { formatDate(v) }
        }
      }],
      yAxes: [{
        id: 'main',
        type: 'linear',
        ticks: {
          beginAtZero: true,
          min: 0,
          fontSize: 13,
          precision: 0,
          callback: (v) => v.toLocaleString()
        }
      }]
    },
    tooltips: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    }
  };
}

window.codeLoaded = true;

if (window.coronaData) {
  initChart();
}
