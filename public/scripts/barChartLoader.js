let chartInstance = null; // later will be used to destroy the older chart and create a new one

let form = document.getElementById("barchartform");
let total = document.getElementById("total-bar");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default nature of the form submission

  let year = form.elements.year.value;
  let month = form.elements.month.value;

  // making post request to the server..

  fetch("/home/getmonthly", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ year, month }),
  })
    .then((response) => {
    //   console.log("Response Status:", response.status); // Log the status
      return response.text(); // Get the response as text first
    })
    .then((text) => {
    //   console.log("Response Body:", text); // Log the raw response body
      return JSON.parse(text); // Parse the text as JSON
    })
    .then((data) => {
    //   console.log("Parsed Data:", data); // Log the parsed data
      renderChart(data); // Call your chart rendering function
    })
    .catch((err) => {
      console.log("error Occured Fetching DATA", err);
    });
});

function getRandomBrightColor() {
  const letters = "89ABCDEF"; // Only bright hex values
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function generateColorPalette(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(getRandomBrightColor());
  }
  return colors;
}

function renderChart(data) {
  const canvas = document.getElementById("bar-chart");
  if (!canvas) {
    console.warn("chart canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");
  // renderin total in the chart. 
  total.innerText = `Total: ${data[data.length-1].totalPerMonth}`;

  // Prepare the data for the chart
  const categories = data.map((item) => item.category);
  const totals = data.map((item) => item.totalPerMonth);
  // Create the bar chart
  const brightColors = generateColorPalette(categories.length);

  // destroy the older chart before the new onw placed
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Total Expenses",
          data: totals,
          backgroundColor: brightColors,
          borderColor: brightColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#fff", // Y-axis number color
        font: {
          size: 14,
          weight: "bold",
        },
      },
      grid: {
        color: "#b5fe2268", // Y-axis grid color
        lineWidth: 1.5,
      },
      title: {
        display: true,
        text: "Total Expense (₹)",
        color: "#fff",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    x: {
      ticks: {
        color: "#fff",
        font: {
          size: 13,
          weight: "bold",
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)", // X-axis grid lines
      },
      title: {
        display: true,
        text: "Categories",
        color: "#fff",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 14,
          weight: "bold",
        },
        color: "#fff"
      },
    },
  }
}
  });
}
