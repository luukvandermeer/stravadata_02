var margin = 24,
  width = 750,
  height = 490;

var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + 'px')
  .attr('height', height + 'px')


//VARIABLES & METRICS
d3.json('data.json').then(function(data) {
  // variables calculations
  var workoutsCount = d3.count(data, d => d.id);
  var workoutsCountWeek = workoutsCount / 52; //devide to count week per year
  var workoutsHours = d3.sum(data, function(d) {return d.elapsed_time / 3600}) //devide to translate to hours
  var workoutsTogether = d3.count(data, d => {if (d.athlete_count >= 2) {return d.id}})
  var workoutsHoursAloneMean = d3.mean(data, function(d) {if (d.athlete_count >= 1) {return d.elapsed_time / 3600}}) //devide to translate to hours
  var workoutsHoursTogetherMean = d3.mean(data, function(d) {if (d.athlete_count >= 2) {return d.elapsed_time / 3600}}) //devide to translate to hours
  var workoutsAloneTogether;if (((workoutsHoursTogetherMean - workoutsHoursAloneMean) / workoutsHoursAloneMean) >= 0) {workoutsAloneTogether = "longer";} else {workoutsAloneTogether = "shorter"} //if statement for shorter or longer rides together
  var countriesVisitedCount = d3.nest() //create seperate array to count the values. Calculation in the span
    .key(function(d) {return d.location_country;})
    .entries(data);
  var countriesVisited = d3.map(data, function(d) {return d.location_country}).keys();
  var tuffestDay = d3.max(data, function(d) {if (d.suffer_score >= (d3.max(data, d => d.suffer_score))) {return d.start_date_local}}) //determine tuffestscore and get start_date_local
  var tuffestDayDetails = d3.max(data, function(d) {if (d.suffer_score >= (d3.max(data, d => d.suffer_score))) {return [(d3.format(",.1f")((d.distance / 1000))) + "km", d.total_elevation_gain + "m", (d3.format(",.1f")(d.moving_time / 3600)) + "h", d.suffer_score + "pt"]}}) //determine tuffestscore and get details
  var farthestDistance = d3.max(data, function(d) {if (d.distance >= (d3.max(data, d => d.distance))) {return (d.distance)}})
  var farthestDistanceDetails = d3.max(data, function(d) {if (d.distance >= (d3.max(data, d => d.distance))) {return [(d3.timeFormat("%B %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))), (d3.format(",.1f")(d.moving_time / 3600)) + "h"]}}) //determine farthestDistance and get details
  // var shortestDistance = d3.min(data, function (d) {if (d.distance>0.1){return d.distance}})
  // console.log(shortestDistance);
  var climbing = d3.sum(data, function(d) {return d.total_elevation_gain})
  var climbingDetails = climbing / 8848 //8848m = mountEverest
  var calories = d3.sum(data, function(d) {return d.kilojoules / 0.239})
  var caloriesDetails = calories / 280 //280cl is applePie

  //Add variables to span
  // d3.select(".workoutsCount").text((workoutsCount))
  d3.select(".workoutsCount").text(0).transition().delay(600).tween('text', tweenText(workoutsCount))
  d3.select(".workoutsCountWeek").text(d3.format(",.1f")(workoutsCountWeek))
  d3.select(".workoutsHoursTotal").text(d3.format(",.1f")(workoutsHours))
  d3.select(".workoutsHoursPerDay").text(d3.format(",.2f")(workoutsHours / 8760)) //devided by total hours a year
  d3.select(".workoutsAlone").text((workoutsCount - workoutsTogether))
  d3.select(".workoutsTogether").text(0).transition().delay(600).tween('text', tweenText(workoutsTogether))
  d3.select(".workoutsHoursChange").text((d3.format("+.0%")((workoutsHoursTogetherMean - workoutsHoursAloneMean) / workoutsHoursAloneMean)) + " " + (workoutsAloneTogether))
  d3.select(".countriesVisitedCount").text(d3.format(",.0f")(countriesVisitedCount.length))
  d3.select(".countriesVisited").text((countriesVisited.join(' | ')))
  d3.select(".tuffestDay").text(d3.timeFormat("%b %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(tuffestDay))) //Calculate date format to timeParse and the to timeFormat Month day
  d3.select(".tuffestDayDetails").text((tuffestDayDetails.join(' | ')))
  d3.select(".farthestDistance").text((d3.format(",.0f")((farthestDistance))))
  d3.select(".farthestDistanceDetails").text((farthestDistanceDetails.join(' | ')))
  // d3.select(".shortestDistance").text((d3.format(",.0f")((shortestDistance))))
  // d3.select(".shortestDistanceDetails").text((shortestDistanceDetails.join(' | ')))
  d3.select(".climbing").text(d3.format(",.0f")(climbing) + "m")
  d3.select(".climbingDetails").text(d3.format(".1f")(climbingDetails) + "x")
  d3.select(".calories").text(d3.format(",.0f")(calories))
  d3.select(".caloriesDetails").text(d3.format(",.0f")(caloriesDetails))

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


//CHART
d3.json('data.json').then(function(data) {

  activeYear = d3.min(data, function(d){ //determine year
    return d3.timeFormat("%Y")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local));
  });

  xMinMax = d3.extent(data, function(d) {
    // return parseFloat(d3.timeFormat("%j")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))); //calculate first data and last day of excersize
  });

  yMinMax = d3.extent(data, function(d) {
    // return parseFloat(d3.timeFormat("%s")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))); //calculate UNIX EPOCH
  });

//ADD SCALE
xScale = d3.scaleTime()
    .domain([new Date (activeYear,00,01), new Date(activeYear,11,30)]) //January = 00
    .nice()
    .range([1, 700]);

yScale = d3.scaleTime()
.domain([new Date("2020-01-01 00:00:00"), new Date("2020-01-01 23:59:59")]) //creates 24h range
.nice()
.range([0,400]);

// Add a scale to the fill or stroke of the circles/lines
// cScale = d3.scaleOrdinal()
// .domain([0,1])
// .range(['#333', '#ff6600'])

//ADD AXIS
xAxis = d3.axisBottom(xScale).tickValues([40,200,300]);
yAxis = d3.axisLeft(yScale);

xAxisG = svg.append('g') //group element xAxis
.attr('id', 'xAxis')
.attr('class', 'xAxis');

yAxisG = svg.append('g') //group element yAxis
.attr('id', 'yAxis')
.attr('class', 'yAxis');

xAxisG.call(xAxis) //syntax to call xAxis
  .attr('transform', 'translate(0,' + (450) +')');
  // .attr('transform', 'translate(0,' + (height-margin) +')');

yAxisG.call(yAxis) //syntax to call xAxis
.attr('transform', 'translate(100,50)');

//LINES
  // lines = svg.selectAll('.line')
  //   .data(data)
  //   .enter()
  //   .append('line')
  //   .attr('class', 'line')
  //   .attr('x1', function(d) {
  //     return xScale(parseFloat(d3.timeFormat("%j")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))); //calculates which day of the year
  //   })
  //   .attr('x2', function(d) {
  //     return xScale(parseFloat(d3.timeFormat("%j")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))); //calculates which day of the year
  //   })
  //   .attr('y1', function(d) {
  //     return d.elapsed_time / 1000;
  //   })
  //   .attr('y2', function(d) {
  //     return d.elapsed_time / 10;
  //   })
  //   .attr('stroke', '#000')

//CIRCLES
  // circlesX1 = svg.selectAll('.circle')
  //   .data(data)
  //   .enter()
  //   .append('circle')
  //   .attr('cx', function(d) {
  //     return xScale(parseFloat(d3.timeFormat("%j")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))); //calculates which day of the year
  //   })
  //   .attr('cy', function(d) {
  //     return d.elapsed_time / 1000;
  //   })
  //   .attr('r', 3)
  //   .attr('width', 20)
  //   .attr('height', 20)
  //   .style('fill', '#55546E');

  circlesX2 = svg.selectAll('.circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('cy', function(d) {
      return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))))) // uses fixed date and variable HH:MM:SS for yScale
    })
    .attr('r', 3)
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', '#55546E')
    .on('mouseover', function(d){
      console.log(d.start_date_local);
    });
});


// // Adds the svg canvas
// var	chart2 = d3.select("#test")
// .append('svg')
// .attr('width', width + 'px')
// .attr('height', height + 'px')
//
// // Get the data
// d3.json('data.json').then(function(data) {
//   svg.append('circle')
//       .attr('cx',function(d) {
//         console.log(d);
//       })
//       .attr('cy', 100)
//       .attr('r', 10)
//       .attr('width', 20)
//       .attr('height', 20);
//
//         });
