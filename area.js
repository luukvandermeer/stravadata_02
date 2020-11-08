//WEEKACTIVITIES//
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 185,
    height = 100,
    textHeight = 20

    var areaWorkoutsPerWeek = d3.select("#areaWorkoutsPerWeek")
      .append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px')

var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun']

var arrayWorkoutsPerWeek = d3.nest()
      .key(function (d) {return(d3.timeFormat("%a")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
      .sortKeys(function(a,b) { return weekDays.indexOf(a) - weekDays.indexOf(b); })
      .rollup(function (values) {return {
        count: d3.count(values, function(d) {return d.id;}),
      }})
      .entries(data)
      .sort();


console.log(arrayWorkoutsPerWeek);

//ADD SCALE
  yScale = d3.scaleLinear()
      .domain([d3.max(arrayWorkoutsPerWeek, d => d.value.count)+1,0])
      .range([0,85-margin]);

    xScale = d3.scaleBand()
    .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'])
    .range([0+margin, width]);

//ADD AXIS
xAxis = d3.axisBottom(xScale)
      .tickValues([(d3.max(arrayWorkoutsPerWeek, function (d) {if (d.value.count >= (d3.max(arrayWorkoutsPerWeek, d => d.value.count))) {return (d.key)}})),"Mon", "Sun"]) //MAX and MONDAY/SUNDAY

xAxisG = areaWorkoutsPerWeek.append('g') //group element xAxis
.attr('id', 'xAxis')
.attr('class', 'xAxis');

xAxisG.call(xAxis) //syntax to call xAxis
  .attr('transform', 'translate(-9,' + (height-textHeight) +')');



svg //creating pattern
  .append('defs')
  .append('pattern')
    .attr('id', 'diagonalHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4)
  .append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
    .attr('stroke', '#FCE545')
    .attr('stroke-width', 0.5);

areaWorkoutsPerWeek //DARK AREACHART
              .datum(arrayWorkoutsPerWeek)
              .append("path")
              .attr('class', 'area1')
              .attr("d", d3.area()
                  .x(function(d) { return xScale(d.key); })
                  .y0(yScale(1))
                  .y1(function(d) { return yScale(d.value.count); })
              )
              .attr("fill", "#55546E")

areaWorkoutsPerWeek //PATTERN AREACHART
                .datum(arrayWorkoutsPerWeek)
                .append("path")
                .attr('class', 'area2')
                .attr("d", d3.area()
                    .x(function(d) { return xScale(d.key); })
                    .y0(yScale(1))
                    .y1(function(d) { return yScale(d.value.count); })
                )
                .attr('fill', 'url(#diagonalHatch)');
});




//SUFFERSCORE//
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 185,
    height = 100,
    textHeight = 20


    var areaSufferScorePerMonth = d3.select("#areaSufferScorePerMonth")
      .append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px')

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec']

var arraySufferScorePerMonth = d3.nest()
      .key(function (d) {return(d3.timeFormat("%b")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
      .sortKeys(function(a,b) { return months.indexOf(a) - months.indexOf(b); })
      .rollup(function (values) {return {
        sum: d3.sum(values, function(d) {return d.suffer_score;}),
      }})
      .entries(data)
      .sort();

//ADD SCALE
  yScale = d3.scaleLinear()
      .domain([d3.max(arraySufferScorePerMonth, d => d.value.sum)+1,20])
      .range([10,85-margin]);

    xScale = d3.scaleBand()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
    .range([9+margin, width]);

//ADD AXIS
xAxis = d3.axisBottom(xScale)
// .attr('class','ticks ')
      .tickValues([(d3.max(arraySufferScorePerMonth, function (d) {if (d.value.sum >= (d3.max(arraySufferScorePerMonth, d => d.value.sum))) {return (d.key)}})),"Jan", "Dec"])

xAxisG = areaSufferScorePerMonth.append('g') //group element xAxis
.attr('id', 'xAxis')
.attr('class', 'xAxis');

xAxisG.call(xAxis) //syntax to call xAxis
  .attr('transform', 'translate(-9,' + (height-textHeight) +')');

areaSufferScorePerMonth
              .datum(arraySufferScorePerMonth)
              .append("path")
              .attr('class', 'area3')
              .attr("d", d3.area()
                  .x(function(d) { return xScale(d.key); })
                  .y0(yScale(0))
                  .y1(function(d) { return yScale(d.value.sum); })
              )
              .attr("fill", "#ffffff")

areaSufferScorePerMonth.selectAll("svg")
   .data(arraySufferScorePerMonth)
   .enter()
   .append("circle")
     .attr("fill", "#55546E")
     .attr("stroke", "none")
     .attr("cx", function(d) { return xScale(d.key) })
     .attr("cy", function(d) { return yScale(d.value.sum) })
     .attr("r", 2)

});
