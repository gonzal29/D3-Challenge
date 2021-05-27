var svgWidth = 760;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/js/data.csv").then(function(smokerData) 
{
console.log(smokerData);
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    smokerData.forEach(function(data) {
      data.state = data.state;
      data.abbr = data.abbr;
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(smokerData, d => d.smokes), d3.max(smokerData, d => d.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(smokerData, d => d.age)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(smokerData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("fill", "steelblue")
    .attr("opacity", ".8")
    .text(function(d){
      return d.abbr
    });
    var labelsGroup = chartGroup.selectAll("texts")
    .data(smokerData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.smokes))
    .attr("y", d => yLinearScale(d.age)+6)
    .attr("r", "15")
    .attr("opacity", "5")
    .attr("class","stateText")
    .text(function(d){
      return d.abbr
    });

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Smokes: ${d.smokes}<br>Age: ${d.age}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    labelsGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age(Median)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Smokes(%)");
  })
  .catch(function(error) {
    console.log(error);
  });
