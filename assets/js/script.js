var text = "asdfghjkl;"; // Home row (---asdfghjkl;----)
var currentIndex = -1;
var randomLetter = '';
var startTime = Date.now();
var keystrokes = 0;
var cpmData = [];
var timeData = [];
var chart;
var dotsData = [];

function getRandomIndex() {
  var newIndex;
  do {
    newIndex = Math.floor(Math.random() * text.length);
  } while (newIndex === currentIndex);
  currentIndex = newIndex;
  return currentIndex;
}

function displayRandomLetter(event) {
  var inputChar = String.fromCharCode(event.keyCode);
  if (text.includes(inputChar)) {
    if (inputChar === text.charAt(currentIndex)) {
      randomLetter = text.charAt(getRandomIndex());
      document.getElementById("randomLetter").textContent = randomLetter;
      keystrokes++;
    }
  }
}

function updateCPM() {
  var currentTime = Date.now();
  var elapsedTime = (currentTime - startTime) / 1000 / 60; // Convert milliseconds to minutes
  var cpm = Math.round(keystrokes / elapsedTime);
  var clockMinute = Math.floor(elapsedTime);
  var previousMinuteCPM = cpmData[clockMinute - 1] || 0;

  cpmData.push(cpm);
  timeData.push(elapsedTime.toFixed(2));

  if (cpmData.length > 20) {
    cpmData.shift(); // Remove the oldest data point if there are more than 20 data points
    timeData.shift();
  }

  if (clockMinute > 0) {
    dotsData[clockMinute - 1] = previousMinuteCPM;
  }

  chart.update();
}

function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var amPm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  var clockTime = hours + ':' + addLeadingZero(minutes) + ':' + addLeadingZero(seconds) + ' ' + amPm;
  document.getElementById("clock").textContent = clockTime;
}

function addLeadingZero(number) {
  return (number < 10 ? '0' : '') + number;
}

window.onload = function() {
  randomLetter = text.charAt(getRandomIndex());
  document.getElementById("randomLetter").textContent = randomLetter;

  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        data: cpmData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointBackgroundColor: function(context) {
          var index = context.dataIndex;
          if (dotsData[index]) {
            return cpmData[index] > dotsData[index] ? '#c2fcf8' : '#c2fcf8';
          }
          return '#c2fcf8';
        },
        pointRadius: function(context) {
          var index = context.dataIndex;
          return dotsData[index] ? 2 : 0;
        },
        pointHoverRadius: function(context) {
          var index = context.dataIndex;
          return dotsData[index] ? 2 : 0;
        },
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          max: 20,
          min: 0,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return value + ' min';
            }
          },
          grid: {
            drawBorder: false,
            color: function(context) {
              if (
                context.tick.value === '1' ||
                context.tick.value === '10' ||
                context.tick.value === '15' ||
                context.tick.value === '20'
              ) {
                return 'rgba(255, 0, 0, 0.5)'; // Highlight timepoints
              }
              return 'rgba(102, 102, 102, 1.0)';
            }
          }
        },
        y: {
          display: true,
          max: 300,
          min: 0,
          ticks: {
            stepSize: 50,
            callback: function(value) {
              return value + ' CPM';
            }
          },
          grid: {
            drawBorder: false,
            color: function(context) {
              if (
                context.tick.value === 100 ||
                context.tick.value === 200 ||
                context.tick.value === 300
              ) {
                return 'rgba(255, 0, 0, 0.5)'; // Highlight reference lines
              }
              return 'rgba(102, 102, 102, 1.0)';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  setInterval(updateClock, 1000);

  document.onkeypress = function(event) {
    displayRandomLetter(event);
    updateCPM();
  };
};