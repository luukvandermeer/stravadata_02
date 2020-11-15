var durationRandom = d3.randomUniform(800, 1500)
var delay = d3.randomUniform(2000, 2000)

// Tween animation of numbers
function tweenText(newValue) {
  return function() {
    var currentValue = +this.textContent;
    // create interpolator and do not show nasty floating numbers
    var i = d3.interpolateRound(currentValue, newValue);
    return function(t) {
      this.textContent = i(t);
    };
  }
}

////////////////////////////////
///////WEEKACTIVITIES//////////
////////////////////////////////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 150,
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
                  .y1(yScale(1))
              )
              .attr("fill", "#55546E")
              .transition()
                   .duration(durationRandom)
                   .attr("d", d3.area()
                       .x(function(d) { return xScale(d.key); })
                       .y0(yScale(0))
                        .y1(function(d) { return yScale(d.value.count); })
                   )
                   .delay(delay)
                   .ease(d3.easePolyIn.exponent(3))


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



////////////////////////////////
////////////SUFFERSCORE/////////
////////////////////////////////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 150,
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
                  .y1(yScale(0))
              )
              .attr("fill", "#ffffff")
              .transition()
                   .duration(durationRandom)
                   .attr("d", d3.area()
                       .x(function(d) { return xScale(d.key); })
                       .y0(yScale(0))
                       .y1(function(d) { return yScale(d.value.sum); })
                   )
                   .delay(delay)
                   .ease(d3.easePolyIn.exponent(3));


areaSufferScorePerMonth.selectAll("circlesArea")
   .data(arraySufferScorePerMonth)
   .enter()
   .append("circle")
     .attr("fill", "#55546E")
     .attr("stroke", "none")
     .attr("cx", function(d) { return xScale(d.key) })
     .attr("cy", function(d) { return yScale(d.value.sum) })
     .attr("r", 2)
    .attr('opacity', 0)
    .transition()
     .duration(durationRandom)
     .attr('opacity', 1)
     .delay(delay);
});


/////////////////////////////
//////COUNTWORKOUTS/////////
////////////////////////////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 140,
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
      // .range([0,0]);

  yScale = d3.scaleBand()
  .domain(typeWorkouts.map(d => d.key))
  .range([0, 20 * typeWorkouts.length]);



barsCountWorkouts.selectAll('svgsize')
.data(typeWorkouts)
.enter()
.append('rect')
.attr('class', 'barflow')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', 0)
.attr('height', 14)
.attr('fill', '#ffffff')
.transition() //ANIMATION
 .duration(durationRandom)
 .attr('width', function(d) { return xScale(d.value.count); })
 .delay(delay)
 .ease(d3.easePolyIn.exponent(3));

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

//ADD TEXT
barsCountWorkouts.selectAll('text')
.data(typeWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(".").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((d => (d.value.count)))
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

////////////////////////////////
///////BARSWORKOUTHOURS/////////
////////////////////////////////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 140,
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
.attr('class', 'barflow')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', 0)
.attr('height', 14)
.attr('fill', '#ffffff')
.transition()
 .duration(durationRandom)
 .attr('width', function(d) { return xScale(d.value.moving_time); })
 .delay(delay)
 .ease(d3.easePolyIn.exponent(3));




//ADD TEXT
barsHoursWorkouts.selectAll('text')
.data(hoursWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.text(".").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(d => (d3.format(",.0f")(d.value.moving_time)))
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

/////////////////////////////////
///////DISTANCEPERWORKOUT///////
////////////////////////////////
d3.json('data.json').then(function(data) {

  var margin = 4,
    width = 140,
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
.attr('width', 0)
.attr('height', 14)
.attr('fill', '#ffffff')
.transition()
 .duration(durationRandom)
 .attr('width', function(d) { return xScale(d.value.distance); })
 .delay(delay)
 .ease(d3.easePolyIn.exponent(3));

//ADD TEXT
barsDistanceWorkouts.selectAll('text')
.data(distanceWorkouts)
.enter()
.append('text')
.attr('x', width - 0)
.attr('y', function(d, i) {return (yScale(d.key))+20; })
.attr("fill", '#55546E')
.style("font", "13px pt mono")
.style('font-weight', 'bold')
.attr("text-anchor", "end")
.text("").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(d => (d3.format(",.1f")(d.value.distance)));

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


});
