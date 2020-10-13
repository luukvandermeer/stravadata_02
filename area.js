
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 200,
    height = 125 - margin

    var areaWorkoutsPerWeek = d3.select("#areaWorkoutsPerWeek")
      .append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px')

  var arrayWorkoutsPerWeek = d3.nest()
      .key(function (d) {return(d3.timeFormat("%a")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
      .rollup(function (values) {return {
        count: d3.count(values, function(d) {return d.id;}),
      }})
      .entries(data);

console.log(arrayWorkoutsPerWeek);


//ADD SCALE
  xScale = d3.scaleLinear()
      .domain([0,d3.max(arrayWorkoutsPerWeek, d => d.value.count)])
      .range([0,width]);

  yScale = d3.scaleBand()
  .domain(arrayWorkoutsPerWeek.map(d => d.key))
  .range([0, 20 * arrayWorkoutsPerWeek.length]);








//ADD BARS
areaWorkoutsPerWeek.selectAll('svg')
.data(arrayWorkoutsPerWeek)
.enter()
.append('rect')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

areaWorkoutsPerWeek.selectAll('svg')
.data(arrayWorkoutsPerWeek)
.enter()
.append('rect')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.count); })
.attr('height', 14)
.attr('fill', '#ffffff');

//ADD TEXT
areaWorkoutsPerWeek.selectAll('text')
.data(arrayWorkoutsPerWeek)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.value.count))
.attr("fill", '#55546E')
.style("font", "13px pt mono")
.style('font-weight', 'bold')
.attr("text-anchor", "end");

areaWorkoutsPerWeek.selectAll('text1')
.data(arrayWorkoutsPerWeek)
.enter()
.append('text')
.attr('x', 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.key))
.attr("fill", '#55546E')
.style("font", "13px pt sans")
.attr("text-anchor", "start");
});
