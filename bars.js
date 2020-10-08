{
var margin = 4,
  width = 200,
  height = 125 - margin



d3.json('data.json').then(function(data) {

  var barsCountWorkouts = d3.select('.barsCountWorkouts')
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px')

  var typeWorkouts = d3.nest()
      .key(function(d) {return (d.type)})
      .rollup(function (values) {return {
        count: d3.count(values, function(d) {return d.id;}),
      }})
      .entries(data);

//ADD SCALE
  xScale = d3.scaleLinear()
      .domain([0,d3.max(typeWorkouts, d => d.value.count)])
      .range([0,width]);

  yScale = d3.scaleBand()
  .domain(typeWorkouts.map(d => d.key))
  .range([0, 20 * typeWorkouts.length]);

//ADD BARS
barsCountWorkouts.selectAll('svg')
.data(typeWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

barsCountWorkouts.selectAll('svg')
.data(typeWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.count); })
.attr('height', 14)
 .attr('fill', '#ffffff')
 .on('mouseover', function(d){
   console.log(d.key);
});

//ADD TEXT
barsCountWorkouts.selectAll('text')
.data(typeWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.value.count))
.attr("fill", '#55546E')
.style("font", "13px pt mono")
.style('font-weight', 'bold')
.attr("text-anchor", "end");

barsCountWorkouts.selectAll('text1')
.data(typeWorkouts)
.enter()
.append('text')
.attr('x', 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.key))
.attr("fill", '#55546E')
.style("font", "13px pt sans")
.attr("text-anchor", "start");
});


////////////////BARSWORKOUTHOURS///////////////////////
d3.json('data.json').then(function(data) {

  var barsHoursWorkouts = d3.select('.barsHoursWorkouts')
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px')

  var typeWorkouts = d3.nest()
      .key(function(d) {return (d.type)})
      .rollup(function (values) {return {
        count: d3.count(values, function(d) {return d.id;}),
      }})
      .entries(data);

//ADD SCALE
  xScale = d3.scaleLinear()
      .domain([0,d3.max(typeWorkouts, d => d.value.count)])
      .range([0,width]);

  yScale = d3.scaleBand()
  .domain(typeWorkouts.map(d => d.key))
  .range([0, 20 * typeWorkouts.length]);

//ADD BARS
barsHoursWorkouts.selectAll('svg')
.data(typeWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

barsHoursWorkouts.selectAll('svg')
.data(typeWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.count); })
.attr('height', 14)
 .attr('fill', '#ffffff')
 .on('mouseover', function(d){
   console.log(d.key);
});

//ADD TEXT
barsHoursWorkouts.selectAll('text')
.data(typeWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.value.count))
.attr("fill", '#55546E')
.style("font", "13px pt mono")
.style('font-weight', 'bold')
.attr("text-anchor", "end");

barsHoursWorkouts.selectAll('text1')
.data(typeWorkouts)
.enter()
.append('text')
.attr('x', 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.key))
.attr("fill", '#55546E')
.style("font", "13px pt sans")
.attr("text-anchor", "start");
});
}
