//////COUNTWORKOUTS/////////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 185,
    height = 125 - margin

    var barsCountWorkouts = d3.select("#barsCountWorkouts")
      .append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px')

  var typeWorkouts = d3.nest()
      .key(function(d) {return (d.type)})
      .rollup(function (values) {return {
        count: d3.count(values, function(d) {return d.id;}),
      }})
      .entries(data)
      .sort(function(a, b){return d3.descending(a.value.count, b.value.count); });

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
// .attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

barsCountWorkouts.selectAll('svg')
.data(typeWorkouts)
.enter()
.append('rect')
// .attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.count); })
.attr('height', 14)
.attr('fill', '#ffffff');

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

  var margin = 4,
    width = 185,
    height = 125 - margin

  var barsHoursWorkouts = d3.select("#barsHoursWorkouts")
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px')

  var hoursWorkouts = d3.nest()
      .key(function(d) {return (d.type)})
      .rollup(function (values) {return {
        moving_time: d3.sum(values, function(d) {return (d.moving_time)/3600;}),
      }})
      .entries(data)
      .sort(function(a, b){return d3.descending(a.value.moving_time, b.value.moving_time); });

//ADD SCALE
  xScale = d3.scaleLinear()
      .domain([0,d3.max(hoursWorkouts, d => d.value.moving_time)])
      .range([0,width]);

  yScale = d3.scaleBand()
  .domain(hoursWorkouts.map(d => d.key))
  .range([0, 20 * hoursWorkouts.length]);

//ADD BARS
barsHoursWorkouts.selectAll('svg')
.data(hoursWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

barsHoursWorkouts.selectAll('svg')
.data(hoursWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.moving_time); })
.attr('height', 14)
.attr('fill', '#ffffff');

//ADD TEXT
barsHoursWorkouts.selectAll('text')
.data(hoursWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d3.format(",.0f")(d.value.moving_time)))
.attr("fill", '#55546E')
.style("font", "13px pt mono")
.style('font-weight', 'bold')
.attr("text-anchor", "end");

barsHoursWorkouts.selectAll('text1')
.data(hoursWorkouts)
.enter()
.append('text')
.attr('x', 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.key))
.attr("fill", '#55546E')
.style("font", "13px pt sans")
.attr("text-anchor", "start");
});


///////DISTANCEPERWORKOUT///////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 185,
    height = 125 - margin

  var barsDistanceWorkouts = d3.select("#barsDistanceWorkouts")
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px')

  var distanceWorkouts = d3.nest()
      .key(function(d) {return (d.type)})
      .rollup(function (values) {return {
        distance: d3.sum(values, function(d) {return ((d.distance)/1000)}),
      }})
      .entries(data)
      .sort(function(a, b){return d3.descending(a.value.distance, b.value.distance); });

//ADD SCALE
  xScale = d3.scaleLinear()
      .domain([0,d3.max(distanceWorkouts, d => d.value.distance)])
      .range([0,width]);

  yScale = d3.scaleBand()
  .domain(distanceWorkouts.map(d => d.key))
  .range([0, 20 * distanceWorkouts.length]);

//ADD BARS
barsDistanceWorkouts.selectAll('svg')
.data(distanceWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

barsDistanceWorkouts.selectAll('svg')
.data(distanceWorkouts)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.distance); })
.attr('height', 14)
.attr('fill', '#ffffff');

//ADD TEXT


barsDistanceWorkouts.selectAll('text')
.data(distanceWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d3.format(",.1f")(d.value.distance)))
.attr("fill", '#55546E')
.style("font", "13px pt mono")
.style('font-weight', 'bold')
.attr("text-anchor", "end");

barsDistanceWorkouts.selectAll('text1')
.data(distanceWorkouts)
.enter()
.append('text')
.attr('x', 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(d => (d.key))
.attr("fill", '#55546E')
.style("font", "13px pt sans")
.attr("text-anchor", "start");

// Tween animation of numbers
function tweenText(newValue) {
  return function() {
    // get current value as starting point for tween animation
    var currentValue = +this.textContent;
    // create interpolator and do not show nasty floating numbers
    var i = d3.interpolateRound(currentValue, newValue);
    return function(t) {
      this.textContent = i(t);
    };
  }
}
});
