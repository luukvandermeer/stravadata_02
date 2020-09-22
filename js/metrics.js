//VARIABLES & METRICS
d3.json('data.json').then(function(data) {
  // variables calculations
  var workoutsCount = d3.count(data, d => d.id);
  var workoutsCountWeek = workoutsCount / 52; //devide to count week per year
  var workoutsHours = d3.sum(data, function(d) {return d.elapsed_time / 3600}) //devide to translate to hours
  var workoutsTogether = d3.count(data, d => {if (d.athlete_count >= 2) {return d.id}})
  var workoutsHoursAloneMean = d3.mean(data, function(d) {if (d.athlete_count == 1) {return d.elapsed_time / 3600}}) //devide to translate to hours
  var workoutsHoursTogetherMean = d3.mean(data, function(d) {if (d.athlete_count >= 2) {return d.elapsed_time / 3600}}) //devide to translate to hours
  var workoutsAloneTogether;if (((workoutsHoursTogetherMean - workoutsHoursAloneMean) / workoutsHoursAloneMean) >= 0) {workoutsAloneTogether = "longer";} else {workoutsAloneTogether = "shorter"} //if statement for shorter or longer rides together
  var countriesVisitedCount = d3.nest() //create seperate array to count the values. Calculation in the span
    .key(function(d) {return d.location_country;})
    .entries(data);
  var countriesVisited = d3.map(data, function(d) {return d.location_country}).keys();
  var tuffestDay = d3.max(data, function(d) {if (d.suffer_score >= (d3.max(data, d => d.suffer_score))) {return d.start_date_local}}) //determine tuffestscore and get start_date_local
  var tuffestDayDetails = d3.max(data, function(d) {if (d.suffer_score >= (d3.max(data, d => d.suffer_score))) {return [(d3.format(",.1f")((d.distance / 1000))) + "km", d.total_elevation_gain + "m", (d3.format(",.1f")(d.moving_time / 3600)) + "h", d.suffer_score + "pt"]}}) //determine tuffestscore and get details
  var farthestDistance = d3.max(data, function(d) {if (d.distance >= (d3.max(data, d => d.distance))) {return (d.distance)}})
  var farthestDistanceDetails = d3.max(data, function(d) {if (d.distance == farthestDistance) {return [(d3.timeFormat("%B %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))), (d3.format(",.1f")(d.moving_time / 3600)) + "h"]}}) //determine farthestDistance and get details
  var shortestDistance = d3.min(data, function(d) {if (d.distance || Infinity){return d.distance}}) //Infintity excludes zero values
  var shortestDistanceDetails = d3.min(data, function(d) {if (d.distance == shortestDistance){return [(d3.timeFormat("%B %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))), (d3.format(",.1f")(d.moving_time / 3600)) + "h"]}}) //determine shortestDistance and get details
  var workoutsVirtual = d3.count(data, d=> {if (d.type == "VirtualRide") {return d.id}})

  var workoutsHoursRealDealMean = d3.mean(data, function(d) {if (d.type || "VirtualRide") {return d.elapsed_time / 3600}}) //devide to translate to hours
  var workoutsHoursVirtualMean = d3.mean(data, function(d) {if (d.type == "VirtualRide") {return d.elapsed_time / 3600}}) //devide to translate to hours
  var workoutsRealdealVirtual;if (((workoutsHoursVirtualMean - workoutsHoursRealDealMean) / workoutsHoursRealDealMean) >= 0) {workoutsRealdealVirtual = "longer";} else {workoutsRealdealVirtual = "shorter"} //if statement for shorter or longer rides Realdeal vs Virtual
  var climbing = d3.sum(data, function(d) {return d.total_elevation_gain})
  var climbingDetails = climbing / 8848 //8848m = mountEverest
  var calories = d3.sum(data, function(d) {return d.kilojoules / 0.239})
  var caloriesDetails = calories / 280 //280cl is applePie

//ROLLUPPS

  var arrayActiveMonth = d3.nest()
      .key(function(d) {return (d3.timeFormat("%B")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
      // .sortKeys(d3.ascending)
      .rollup(function (values) {return {
        movingtime: d3.sum(values, function(d) {return d.moving_time;}),
        distance: d3.sum(values, function(d) {return d.distance;}),
        elevation: d3.sum(values, function(d) {return d.total_elevation_gain;})
      }})
      .entries(data);

console.log(arrayActiveMonth);

// var max = d3.max(arrayActiveMonth, function (d) {return +d.movingtime;});

var leastActiveMonth = d3.min(d3.values(arrayActiveMonth), function(d) {return d.movingtime})

console.log(leastActiveMonth);

var workoutsPerWeek = d3.nest()
    .key(function(d) {return (d3.timeFormat("%a")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
    // .sortKeys(d3.ascending)
    .rollup(function (values) {return {
      count: d3.count(values, function(d) {return d.id;}),
    }})
    .entries(data);

var sufferscorePerMonth = d3.nest()
    .key(function(d) {return (d3.timeFormat("%b")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
        // .sortKeys(d3.ascending)
    .rollup(function (values) {return {
        suffer_score: d3.sum(values, function(d) {return d.suffer_score;}),
    }})
    .entries(data);




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
  d3.select(".shortestDistance").text((d3.format(",.0f")((shortestDistance))))
  d3.select(".shortestDistanceDetails").text((shortestDistanceDetails.join(' | ')))

  d3.select(".workoutsRealdeal").text((workoutsCount - workoutsVirtual))
  d3.select(".workoutsVirtual").text(workoutsVirtual)
  d3.select(".workoutsHoursChangeVirtual").text((d3.format("+.0%")((workoutsHoursVirtualMean - workoutsHoursRealDealMean) / workoutsHoursRealDealMean)) + " " + (workoutsRealdealVirtual))

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
