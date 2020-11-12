//VARIABLES & METRICS
d3.json('data.json').then(function(data) {
  // variables calculations
  const workoutsCount = d3.count(data, d => d.id);
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
      .key(function(d) {return (d3.timeFormat("%b")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
      // .sortKeys(d3.ascending)
      .rollup(function (values) {return {
        moving_time: d3.sum(values, function(d) {return d.moving_time;}),
        distance: d3.sum(values, function(d) {return d.distance;}),
        total_elevation_gain: d3.sum(values, function(d) {return d.total_elevation_gain;})
      }})
      .entries(data);

var mostActiveMonth = d3.max(arrayActiveMonth, function (d) {if (d.value.moving_time >= (d3.max(arrayActiveMonth, d => d.value.moving_time))) {return (d.key)}});
var mostActiveMonthDetails = d3.max(arrayActiveMonth, function(d) {if (d.value.moving_time >= (d3.max(arrayActiveMonth, d => d.value.moving_time))) {return [(d3.format(",.1f")((d.value.distance / 1000))) + "km", (d3.format(",.1f")(d.value.total_elevation_gain)) + "m", (d3.format(",.1f")(d.value.moving_time / 3600)) + "h"]}})
var leastActiveMonth = d3.min(arrayActiveMonth, function (d) {if (d.value.moving_time <= (d3.min(arrayActiveMonth, d => d.value.moving_time))) {return (d.key)}});
var leastActiveMonthDetails = d3.min(arrayActiveMonth, function(d) {if (d.value.moving_time <= (d3.min(arrayActiveMonth, d => d.value.moving_time))) {return [(d3.format(",.1f")((d.value.distance / 1000))) + "km", (d3.format(",.1f")(d.value.total_elevation_gain)) + "m", (d3.format(",.1f")(d.value.moving_time / 3600)) + "h"]}})

var arrayActiveTimeOfDay = d3.nest()
  .key(function (d) {return(d3.timeFormat("%H")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
  // .sortKeys(d3.ascending)
  .rollup(function (values) {return {
    moving_time: d3.sum(values, function(d) {return d.moving_time;}),
    distance: d3.sum(values, function(d) {return d.distance;}),

    total_elevation_gain: d3.sum(values, function(d) {return d.total_elevation_gain;}),
    workouts: d3.count(values, d => d.id)
  }})
  .entries(data);

var activeTimeOfDay = d3.max(arrayActiveTimeOfDay, function (d) {if (d.value.moving_time >= (d3.max(arrayActiveTimeOfDay, d => d.value.moving_time))) {return (d.key)}});
var activeTimeOfDayDetails = d3.max(arrayActiveTimeOfDay, function(d) {if (d.value.moving_time >= (d3.max(arrayActiveTimeOfDay, d => d.value.moving_time))) {return [d.value.workouts]}})

  //Add variables to span
  var durationRandom = d3.randomUniform(0, 600)
  var delay = d3.randomUniform(2000, 2000)
  // d3.select(".workoutsCount").text((workoutsCount))
  d3.select(".activeYear").text(d3.timeFormat("%Y")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(tuffestDay)))
  d3.select(".workoutsCount").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText(workoutsCount))
  d3.select(".workoutsCountWeek").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenTextDecimals((d3.format(",.1f")(workoutsCountWeek))))
  d3.select(".workoutsHoursTotal").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((d3.format(",.1f")(workoutsHours))))
  d3.select(".workoutsHoursPerDay").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenTextDecimals((d3.format(",.2f")(workoutsHours / 365))))
  d3.select(".workoutsAlone").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((workoutsCount - workoutsTogether)))
  d3.select(".workoutsTogether").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText(workoutsTogether))
  d3.select(".workoutsHoursChange").text((d3.format("+.0%")((workoutsHoursTogetherMean - workoutsHoursAloneMean) / workoutsHoursAloneMean)) + " " + (workoutsAloneTogether))
  d3.select(".countriesVisitedCount").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((d3.format(",.0f")(countriesVisitedCount.length))))
  d3.select(".countriesVisited").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((countriesVisited.join(' | ')))
  d3.select(".tuffestDay").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(d3.timeFormat("%b %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(tuffestDay))) //Calculate date format to timeParse and the to timeFormat Month day
  d3.select(".tuffestDayDetails").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((tuffestDayDetails.join(' | ')))
  d3.select(".farthestDistance").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((farthestDistance/1000)))
  d3.select(".farthestDistanceDetails").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((farthestDistanceDetails.join(' | ')))
  d3.select(".shortestDistance").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((d3.format(",.0f")((shortestDistance)))))
  d3.select(".shortestDistanceDetails").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((shortestDistanceDetails.join(' | ')))
  d3.select(".mostActiveMonth").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(mostActiveMonth)
  d3.select(".mostActiveMonthDetails").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((mostActiveMonthDetails.join(' | ')))
  d3.select(".leastActiveMonth").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(leastActiveMonth)
  d3.select(".leastActiveMonthDetails").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text((leastActiveMonthDetails.join(' | ')))
  d3.select(".activeTimeOfDay").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(activeTimeOfDay + ":00")
  d3.select(".activeTimeOfDayDetails").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText(activeTimeOfDayDetails))

  d3.select(".workoutsRealdeal").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((workoutsCount - workoutsVirtual)))
  d3.select(".workoutsVirtual").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenText((workoutsVirtual)))
  d3.select(".workoutsHoursChangeVirtual").text((d3.format("+.0%")((workoutsHoursVirtualMean - workoutsHoursRealDealMean) / workoutsHoursRealDealMean)) + " " + (workoutsRealdealVirtual))

  d3.select(".climbing").text(0).transition().delay(delay).duration(durationRandom).tween('text', (tweenTextThousands((climbing)))) + "m"
  d3.select(".climbingDetails").text(".").style("color", "#FCE545").transition().style("opacity", 0).delay(delay).duration(durationRandom).transition().style("opacity",1).style("color", "#55546E").text(d3.format(".1f")(climbingDetails) + "x")
  d3.select(".calories").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenTextThousands((calories)))
  d3.select(".caloriesDetails").text(0).transition().delay(delay).duration(durationRandom).tween('text', tweenTextThousands((caloriesDetails)))

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

  // Tween animation of numbers
  function tweenTextDecimals(newValue) {
    return function() {
      var currentValue = +this.textContent;
      var i = d3.interpolate(currentValue, newValue);
      return function(t) {
                d3.select(this).text(d3.format(",.2f")(i(t)));
      };
    }
  }

  function tweenTextThousands(newValue) {
    return function() {
      var currentValue = +this.textContent;
      var i = d3.interpolate(currentValue, newValue);
      return function(t) {
                d3.select(this).text(d3.format(",.0f")(i(t)));
      };
    }
  }

});
