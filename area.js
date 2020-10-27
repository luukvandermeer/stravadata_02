d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 200,
    height = 100,
    textHeight = 20


    var areaWorkoutsPerWeek = d3.select("#areaWorkoutsPerWeek")
      .append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px')

  var arrayWorkoutsPerWeek = d3.nest()
      .key(function (d) {return(d3.timeFormat("%a")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})

            // .key(function (d) {(d.start_date_local)})
      .rollup(function (values) {return {
        count: d3.count(values, function(d) {return d.id;}),
      }})
      .entries(data)
      .sort();


console.log(arrayWorkoutsPerWeek);

//ADD SCALE
  yScale = d3.scaleLinear()
      .domain([0,d3.max(arrayWorkoutsPerWeek, d => d.value.count)])
      .range([0,height-textHeight]);

    xScale = d3.scaleBand()
    // .domain(arrayWorkoutsPerWeek.map(d => d.key))
        .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'])
    .range([0+margin, width]);

//ADD AXIS
xAxis = d3.axisBottom(xScale)

xAxisG = areaWorkoutsPerWeek.append('g') //group element xAxis
.attr('id', 'xAxis')
.attr('class', 'xAxis');

xAxisG.call(xAxis) //syntax to call xAxis
  .attr('transform', 'translate(-9,' + (height-textHeight) +')');

// Add the area
// areaWorkoutsPerWeek.selectAll("svg")
//     .datum(arrayWorkoutsPerWeek)
//     .enter()
//     .append("path")
//     .attr('class', 'line1')
//     .attr("fill", "#000000")
//     .attr("stroke", "#000000")
//     .attr("stroke-width", 1.5)
//     .attr("d", function(d, i) { return d3.line()
//                 .defined(d => d !== null)
//                 .x((d) => xScale(d.key))
//                 .y((d) => yScale(d.value.count));
//   });
areaWorkoutsPerWeek
       .datum(arrayWorkoutsPerWeek)
       .append("path")
       .attr('class', 'my-second-awesome-line-class')
       .attr("d", d3.line()
           .x(function(d) { return xScale(d.key); })
           .y(function(d) { return yScale(d.value.count); })
       )
       .attr("fill", "none")
       .attr("stroke", "#000000")
       .attr("stroke-width", 1.5)

  //
  areaWorkoutsPerWeek.selectAll("svg")
        .data(arrayWorkoutsPerWeek)
        .enter()
        .append("path")
        .attr('class', 'line2')
        .attr("d", function (d, i) {
          d3.line()
          .x(function(d) { return xScale(d.key); })
          .y(function(d) { return yScale(d.value.count); })
        })
        .attr("fill", "#000000")
        .attr("stroke", "#000000")
        .attr("stroke-width", 1.5)



    areaWorkoutsPerWeek.selectAll("svg")
   .data(arrayWorkoutsPerWeek)
   .enter()
   .append("circle")
     .attr("fill", "red")
     .attr("stroke", "none")
     .attr("cx", function(d) { return xScale(d.key) })
     .attr("cy", function(d) { return yScale(d.value.count) })
     .attr("r", 1.5)
});
