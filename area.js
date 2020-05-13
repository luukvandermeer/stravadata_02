
var margin = {top: 2, right: 2, bottom: 2, left: 2},
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var area = d3.select(".area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    area.append("g")
      .attr("transform", "translate(0," + height + ")")
      // .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    area.append("g")
      // .call(d3.axisLeft(y));

    // Add the area
    area.append("path")
      .datum(data)
      .attr("fill", "#55546E")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return x(d.date) })
        .y0(y(0))
        .y1(function(d) { return y(d.value) })
        )
        //
    area.append("circle")
      .datum(data)
            .enter()
            .append("path")
                  .style("fill", (d, i) => '#DBDBDB')
                  .selectAll("circle")
                  // .data(d => d.data)
                  .enter()
                  .append("g")
                  .attr("class", "circle")
                  .append("circle")
                  .attr('stroke', '#ffffff')
                  .attr('stroke-width', '100px')
                  .attr("cx", function(d) {return x(d.date)})
                  .attr("cy", function(d) {return y(d.value)})
                  .attr("r", 60)
                  .style('opacity', 1)

})


//
// d3.json('data.json').then(function(data) {
//
