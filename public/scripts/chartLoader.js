
document.addEventListener("DOMContentLoaded",()=>{

    const data = window.chartData;
    //pi chart. 
    //console.log(data); // Log the data to check its structure

      // Extended color palette (20 distinct colors)
  const backgroundColors = [
  '#2196F3', // Medium Blue
  '#4CAF50', // Vibrant Green
  '#FFC107', // Amber Yellow
  '#FF5722', // Deep Orange
  '#9C27B0', // Purple
  '#00BCD4'  // Cyan
  ];

    const categoryCtx = document.getElementById("cat-chart").getContext('2d');

    new Chart(categoryCtx,{

        type:'pie',
        data:{
            labels:data.byCategory.map(c=>c.Category),
            datasets:[{
                label:'Expense By Category',
                data:data.byCategory.map(c=>c.total),
        // Dynamically assign colors (cycle through palette if needed)
        backgroundColor: data.byCategory.map((_, index) => 
          backgroundColors[index % backgroundColors.length]
        ),
        borderWidth: 1,
      }],
    },
    // color change of the labels.. 
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#fff', // Dark gray for visibility
            font: {
              family: "'Arial', sans-serif",
              size: 16,
              weight: 'bold'
            }
          }
        },
      }
    }
  });
});

