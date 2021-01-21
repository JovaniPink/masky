// Build init function 
function init() {

    // FOR TESTING: Run usCharts 
    usCharts();
};

// Initialize Dashboard
init();

// Build Charts Function
function usCharts() {

    // Use d3 to retrieve API data
    d3.json("https://api.covidtracking.com/v1/us/daily.json").then((data) => {
        
        // Create arrays to hold data of interest for the chart X values
        var date = [];
        var currHospital = [];
        var currICU = [];
        var currVent = [];

        // Create arrays to hold the tickValues for x axis
        var currMonth = "";
        var tickVals = [];
        var tickText = [];
  
        // Loop through the data set to fill Covid arrays
        for (let i in data) {
          var tempName = data[i].state;
  
          // Skip territories
          if (tempName == "AS" || tempName == "GU" || tempName == "MP" || tempName == "PR" || tempName == "VI") {
              console.log('Skipped Territory ' + tempName)
          }
          else {  
              // Create date array as string
              let str = data[i].date.toString();
              var month = str.slice(4,6);
              var day = str.slice(6,);
              var year = str.slice(0,4);
              var fDate = year + "-" + month + "-" +day;
              date.push(fDate);

              // Populate tick arrays
              if (month !== currMonth) {
                tickText.push((moment().month(month-1).format("MMMM")) + " " + year);
                tickVals.push(fDate);
                var currMonth = month
              };

              // Populate current hospital total
              let curr = data[i].hospitalizedCurrently;
              currHospital.push(curr);
  
              // Populate current ICU total
              let icu = data[i].inIcuCurrently
              currICU.push(icu);
  
              // Populate current ventilator total
              let vent = data[i].onVentilatorCurrently;
              currVent.push(vent);
            }
        };

        // Transform arrays into ascending date order
        date.reverse();
        currHospital.reverse();
        currICU.reverse(),
        currVent.reverse();
        tickVals.reverse();
        tickText.reverse();

        // Ventilator v. ICU v. Hospitalized Animation
        // Define frames
        var speedDelta = 2
        var n = Math.ceil(date.length/speedDelta);
        var frames = [];
  
        for (var i = 0; i < n; i++) {
            frames[i] = {data: [
              {x: [], y: []}, 
              {x:[], y: []},
              {x:[], y: []}
            ]};

            var i2 = i * speedDelta;
            if(i2 >= date.length) {
              i2 = date.length -1
            }

            frames[i].data[0].x = date.slice(0, i2+1);
            frames[i].data[0].y = currVent.slice(0, i2+1);
            frames[i].data[1].x = date.slice(0, i2+1);
            frames[i].data[1].y = currICU.slice(0, i2+1);
            frames[i].data[2].x = date.slice(0, i2+1);
            frames[i].data[2].y = currHospital.slice(0, i2+1);
        }
        
        // Define "Ventilator" Trace
        var trace0 = {
          type: 'scatter',
          mode: 'lines',
          name: 'Currently Ventilated ',
          fill: 'tonexty',
          x: frames[30].data[0].x, 
          y: frames[30].data[0].y,
          line: {color: '#a31600'}
        }
        
        // Define "ICU" Trace
        var trace1 = {
          type: 'scatter',
          mode: 'lines',
          name: 'Currently in the ICU',
          fill: 'tonexty',
          x: frames[30].data[1].x, 
          y: frames[30].data[1].y,
          line: {color: "#ee762a"}
        }

        // Define "Hospitalized" Trace
        var trace2 = {
          type: 'scatter',
          mode: 'lines',
          name: 'Currently Hospitalized',
          fill: 'tonexty',
          x: frames[30].data[2].x, 
          y: frames[30].data[2].y,
          line: {color: '#fbd256'}
        }
  
        // Create data object
        var data = [trace0, trace1, trace2];
  
        // Define Layout
        // Buffer allows for most responsive design as data is updated
        let buffer = 20000
        var d = date.length;
        var xrange = [date[0],date[d-1]]
        var yrange = [0, (currHospital[d-1] + buffer)]

        var layout = {
            title: {
              text:'COVID-19 Hospital Burden in the US',
              font: {
                family: 'Open Sans',
                color: 'white',
                size: 28 
              },
              xref: 'container',
              yref: 'container',
              pad: {
                t:10
              }
            },
            xaxis: {
              visible: true,
              color: 'white',
              title: {
                text: 'Date',
                font: {
                  family: 'Open Sans',
                  color: 'white',
                  size: 16
                },
                standoff: 15
              },
              automargin: true,
              range: xrange,
              type: 'date',
              showgrid: false,
              tickVals: tickVals,
              tickText: tickText
            },
            yaxis: {
              color: 'white',  
              title: {
                text: 'Number of Cases',
                font: {
                  family: 'Open Sans',
                  color: 'white',
                  size: 16
                },
                standoff: 25
              },
              automargin:true,
              range: yrange,
              rangemode: 'nonnegative',
              type: 'linear',
              tick0: 0,
              dtick: 20000,
              showgrid: false
            },
            legend: {
              font: {color: 'white'},
              orientation:'h',
              x: 0.5,
              y: 1.2,
              xanchor: 'center'
            },
            paper_bgcolor: '#3e3e3e',
            plot_bgcolor: '#3e3e3e',
            margin: {
              l:50,
              r:50,
              t:100,
              b:10
            },
            updatemenus: [{
                x: 0.5,
                y: -0.3,
                yanchor: "top",
                xanchor: "center",
                showactive: false,
                font: {
                  family: 'Open Sans',
                  color: 'white'
                },
                bordercolor: 'white',
                direction: "left",
                pad: {
                  t:10,
                  b: 10
                },
                type: "buttons",
                buttons: [{
                  method: "animate",
                  args: [null, {
                    fromcurrent: true,
                    transition: {
                      duration: 0,
                    },
                    frame: {
                      duration: 40,
                      redraw: false
                    }
                  }],
                  label: "Play" }, 
                  {
                  method: "animate",
                  args: [
                    [null],
                    {
                      mode: "immediate",
                      transition: {
                        duration: 0
                      },
                      frame: {
                        duration: 0,
                        redraw: false
                      }
                    }
                  ],
                  label: "Pause"
                }]
            }]
        };
        Plotly.newPlot('animation', data, layout).then(function() {
          Plotly.addFrames('animation', frames);
        });
    });
  };    
  
  // We need to be sure to add a "Last Updated" note at the bottom of the page, which can be filled via a ref to the API's "dateChecked" field
  