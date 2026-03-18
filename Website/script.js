// HOVER ACTIVE ICON ON SIDEBAR 
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu-item");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {
const sectionTop = section.offsetTop;
const sectionHeight = section.clientHeight;

if (pageYOffset >= sectionTop - 200) {
current = section.getAttribute("id");
}
});

navLinks.forEach(link => {
link.classList.remove("active");

if(link.getAttribute("href") === "#" + current){
link.classList.add("active");
}
});

});

// STAR RATING DISTRIBUTION
new Chart(document.getElementById("ratingChart"), {
  type: "bar",
  data: {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [{
      label: "Number of Reviews",
      data: [5210000, 8370000, 9030000, 17680000, 62610000],
      backgroundColor: "#0c2d51",
      borderRadius: 5,
      barPercentage: 0.8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Format Y-axis labels
          callback: function(value) {
            return (value / 1000000) + "M"; // convert to millions
          }
        }
      }
    }
  }
});

// TRAIN AND TEST ERRORS LINE PLOT
const ctxerrors = document.getElementById("traintesterrors").getContext("2d");
const numTrees = Array.from({length: 25}, (_, i) => 1 + i*2);
const trainErrors = [0.6135, 0.6095, 0.6102, 0.610, 0.6105];
const testErrors  = [0.6118, 0.6085, 0.6091, 0.6087, 0.6093];
const trainData = numTrees.map((x, i) => ({x: x, y: trainErrors[i]}));
const testData  = numTrees.map((x, i) => ({x: x, y: testErrors[i]}));

new Chart(ctxerrors, {
    type: "line",
    data: {
        datasets: [
            {
                label: "Train Errors",
                data: trainData,
                borderColor: "rgb(127, 187, 252)",
                backgroundColor: "rgb(127, 187, 252)",
                fill: false,
                tension: 0.3,
                pointStyle: "circle",
                pointRadius: 5
            },
            {
                label: "Validation Errors",
                data: testData,
                borderColor: "rgb(255, 183, 0)",
                backgroundColor: "rgb(255, 183, 0)",
                fill: false,
                tension: 0.3,
                pointStyle: "rect",
                pointRadius: 5
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",   // top of chart
                align: "center",      // push to right
                labels: {
                    color: "black",       // text color
                    usePointStyle: true,  // show colored point boxes
                    pointStyle: "rect",   // rectangle box
                    boxWidth: 20,         // size of color box
                    padding: 10
                },
            }
        },
        scales: {
            x: {
                type: "linear", // numeric axis
                min: 0,
                max: 50,
                title: {
                    display: true,
                    text: "Trees",
                    color: "black",
                    font: { size: 16, weight: "bold" }
                },
                ticks: {
                    color: "black",
                    stepSize: 10
                }
            },
            y: {
                min: 0.608,
                max: 0.614,
                title: {
                    display: true,
                    text: "Errors",
                    color: "black",
                    font: { size: 16, weight: "bold" }
                },
                ticks: { 
                    color: "black", 
                }
            }
        }
    }
});

// RANDOM FOREST FEATURE IMPORTANCE BAR CHART
const features = [
    'review_word_counts',
    'review_len',
    'helpful_ratio',
    'review_headline_len',
    'category_idx',
    'total_votes',
    'review_headline_word_counts',
    'verified_purchase_idx'
];

const importances = [
    0.248081,
    0.210397,
    0.169301,
    0.126052,
    0.122743,
    0.105226,
    0.018200,
    0.000000
];

const ctximportance = document.getElementById('featureimportance').getContext('2d');

new Chart(ctximportance, {
    type: 'bar',
    data: {
        labels: features,
        datasets: [{
            label: 'Importance',
            data: importances,
            backgroundColor: 'rgba(0, 100, 207, 0.7)',
            borderColor: 'rgba(0, 100, 207, 0.7)',
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y', // horizontal bar chart
        responsive: true,
        plugins: {
            legend: { display: false }, // optional
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        return context.raw.toFixed(5); // show 5 decimals
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Importance',
                    font: { size: 16, weight: 'bold' }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Features',
                    font: { size: 16, weight: 'bold' }
                },
                ticks: { color: 'black' }
            }
        }
    }
});

