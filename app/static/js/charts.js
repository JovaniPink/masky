// Build init function 
function init() {

  // FOR TESTING: Run usCharts 
  stateCharts();
  
};

// Initialize Dashboard
init();


// Build stateCharts Function
function stateCharts() {
  d3.json("../../mask-dashboard/locations.json").then((locations) => {
      // Declare arrays from locations data
      var stateNames = [];
      var stateLat = [];
      var stateLong = [];    
      var statePop = [];

      // Loop through locations to fill arrays
      for (i in locations) {
          // Access and save properties
          let names = locations[i].name;
          let lat = locations[i].lat;
          let long = locations[i].long;
          let pop = locations[i].pop;
          
          // Push properties to their arrays
          stateNames.push(names);
          stateLat.push(lat);
          stateLong.push(long);
          statePop.push(pop);
      };
      
      // Use d3 to retrieve API data
      d3.json("https://api.covidtracking.com/v1/states/current.json").then((data) => {
      
          // Create arrays to hold data of interest for the chart X values
          var stateDate = [];
          var stateCurrHospital = [];

          // Loop through the data set to fill arrays
          for (let i in data) {
              
              var tempName = data[i].state;

              // Skip territories and DC
              if (tempName == "AS" || tempName == "GU" || tempName == "MP" || tempName == "PR" || tempName == "VI") {
                  console.log('Skipped Territory ' + tempName)
              }
              else {
                  // Create date object array
                  let str = data[i].date.toString();
                  let month = str.slice(4,6);
                  let day = str.slice(6,);
                  let year = str.slice(0,4);
                  let fDate = new Date(year, (month-1), day).toLocaleDateString()
                  stateDate.push(fDate);

                  // Create current hospital total
                  let curr = (data[i].hospitalizedCurrently);
                  stateCurrHospital.push(curr);

                  // Calculate curr. hospital rate as percent of state population
                  var hospitalRatio = new Array(stateCurrHospital.length)
                  for(i=0; i<stateCurrHospital.length; i++) {
                      hospitalRatio[i] = (stateCurrHospital[i] / statePop[i]) *100;
                  }
              }    
          };

          // US Map - Scatter of Current Hospital Rates          
          // Define hoverText
          var hoverText = [];

          for (i in stateNames, stateCurrHospital) {
              var currentText = stateNames[i] + "<br>Current Hospitalizations: " + stateCurrHospital[i];
              hoverText.push(currentText); 
          };
          
          // Define characteristics - marker size
          // scale selected as best fit for data after trial and error
          let scale = 500
          var marksize = [];
          for (i in hospitalRatio) {
              var ratio = hospitalRatio[i] * scale;
              marksize.push(ratio);
          };

          // Define characteristics - color scale
          var minColor = Math.min.apply(Math, hospitalRatio)
          var maxColor = Math.max.apply(Math, hospitalRatio);

          // Define data trace
          var data = [{
              type: 'scattergeo',
              locationmode: 'USA-states',
              lon: stateLong,
              lat: stateLat,
              hoverinfo: 'text',
              text: hoverText,
              mode: 'markers',
              marker: {
                  symbol: 'circle',
                  size: marksize,
                  opacity: 0.8,
                  color: hospitalRatio,
                  colorscale: 'Jet',
                  cmin: minColor,
                  cmax: maxColor,
                  showscale: true,
                  colorbar: {
                      tickcolor: "white",
                      tickfont: { color: "white" },
                  },
              }
          }];

          // Define Layout
          var layout = {
              title: {
                  text:"Current US Hospitalizations by State",
                  font: {
                      family: "Open Sans",
                      color: "white",
                      size: 28                   
                  },
                  yanchor: "top",
              },
              annotations: [{
                  text: "(as percentage of state population)",
                  font: {
                      family: "Open Sans",
                      color: "white",
                      size: 20,                        
                  },
                  xref: "paper",
                  xanchor: "center",
                  xshift: 30,
                  yref: "container",
                  y: 1,
                  yanchor: "top",
                  showarrow: false,
              }],
              colorbar: true,
              geo: {
                  scope: 'usa',
                  projection: { type: 'albers usa'},
                  showland: true,
                  landcolor: '#4d4d4d',
                  showlakes: false,
                  showrivers: false,
                  lakecolor: "#3e3e3e",
                  bgcolor:'#3e3e3e',
                  subunitcolor: "white"
              },
              margin:{
                  l: 25,
                  r: 25,
                  t: 50,
                  b: 25
              },
              paper_bgcolor: '#3e3e3e',
              plot_bgcolor: '#3e3e3e',
              hoverlabel: {
                  font: { size: 16 }
              },
          };

          // Define Config for responsivity and map size
          var config = {
              scale: 0.5,
              responsive: true
          };
          
          // Plot in div
          Plotly.newPlot('bubble', data, layout, config);                                   
      });
  },
  console.log("Loaded!"));
};