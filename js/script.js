var margin = 0,
    width = 800,
    height = 500;

var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px')

d3.json('data.json').then(function(data) {
    lines = svg.selectAll('.line')
        .data(data)
        .enter()
        .append('line')
        .attr('class', 'line')
        .attr('x1', function(d) {
            return d.average_heartrate*2;
        })
        .attr('x2', function(d) {
            // return (d3.time.format("%e")(d.start_date_local));
            return d.average_heartrate*2;
        })
        .attr('y1', function(d) {
            return d.elapsed_time/1000;
        })
        .attr('y2', function(d) {
            return d.elapsed_time/10;
        })
        .attr('stroke', '#000')
        .on('mouseover', function(d,i){
            html = 'Startdate: ' + d.start_date_local + '<br />';
            // html = 'Startdate: ' + (d3.time.format("%d d")(d.start_date_local) + '<br />';
            html += 'Movingtime: ' + d.moving_time + '<br />';
            html += 'Movingtime: ' + d.average_heartrate *20 + '<br />';
            d3.select('#tooltip')
                .html(html)
                .style('left', d3.event.pageX - 100)
                .style('top', d3.event.pageY - 150)
                .style('opacity', 0.85);
        })
        .on('mouseout', function(){
            d3.select('#tooltip')
                .delay('delay', '50')
                .style('left', -1000)
                .style('opacity', 0);
        });
    // console.log(data);


// variables calculations
var workoutsCount = d3.count(data, d => d.id);
var workoutsCountWeek = workoutsCount/52; //devide to count week per year
var workoutsHours = d3.sum(data, function(d) {return d.elapsed_time/3600}) //devide to translate to hours
var workoutsTogether = d3.count(data, d => {if (d.athlete_count>=2) {return d.id}})
var workoutsHoursAloneMean = d3.mean(data, function(d) {if (d.athlete_count>=1) {return d.elapsed_time/3600}}) //devide to translate to hours
var workoutsHoursTogetherMean = d3.mean(data, function(d) {if (d.athlete_count>=2) {return d.elapsed_time/3600}}) //devide to translate to hours
var workoutsAloneTogether; if (((workoutsHoursTogetherMean-workoutsHoursAloneMean)/workoutsHoursAloneMean)>=0) {workoutsAloneTogether = "longer";} else {workoutsAloneTogether = "shorter"} //if statement for shorter or longer rides together
var countriesVisitedCount = d3.nest() //create seperate array to count the values. Calculation in the span
  .key(function(d) {return d.location_country;})
  .entries(data);
var countriesVisited = d3.map(data, function(d) {return d.location_country}).keys();
var tuffestDay = d3.max(data, function (d) {if (d.suffer_score>=(d3.max(data, d => d.suffer_score))) {return d.start_date_local}}) //determine tuffestscore and get start_date_local
var tuffestDayDetails = d3.max(data, function (d) {if (d.suffer_score>=(d3.max(data, d => d.suffer_score))) {return [(d3.format(",.1f")((d.distance/1000)))+"km", d.total_elevation_gain+"m", (d3.format(",.1f")(d.moving_time/3600))+"h", d.suffer_score+"pt"]}})//determine tuffestscore and get details
var farthestDistance = d3.max(data, function (d) {if (d.distance>=(d3.max(data, d => d.distance))) {return (d.distance/1000)}})
var farthestDistanceDetails = d3.max(data, function (d) {if (d.distance>=(d3.max(data, d => d.distance))) {return [(d3.timeFormat("%b %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))), (d3.format(",.1f")(d.moving_time/3600))+"h"]}})


var shortestDistance = d3.min(data, function (d) {if (((d3.min(data, d => d.distance)>=(0.1))) && (d.distance<=(d3.min(data, d => d.distance)))) {return (d.distance/1000)}})
// var shortestDistanceDetails = d3.min(data, function (d) {if (d.distance<=(d3.min(data, d => d.distance))) {return [(d3.timeFormat("%b %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))), (d3.format(",.1f")(d.moving_time/3600))+"h"]}})

console.log(shortestDistance);
// console.log(shortestDistanceDetails);

//Add variables to span
// d3.select(".workoutsCount").text((workoutsCount))
d3.select(".workoutsCount").text(0).transition().delay(600).tween('text', tweenText(workoutsCount))
d3.select(".workoutsCountWeek").text(d3.format(",.1f")(workoutsCountWeek))
d3.select(".workoutsHoursTotal").text(d3.format(",.1f")(workoutsHours))
d3.select(".workoutsHoursPerDay").text(d3.format(",.2f")(workoutsHours/8760)) //devided by total hours a year
d3.select(".workoutsAlone").text((workoutsCount-workoutsTogether))
d3.select(".workoutsTogether").text(0).transition().delay(600).tween('text', tweenText(workoutsTogether))
d3.select(".workoutsHoursChange").text((d3.format("+.0%")((workoutsHoursTogetherMean-workoutsHoursAloneMean)/workoutsHoursAloneMean))+" "+(workoutsAloneTogether))
d3.select(".countriesVisitedCount").text(d3.format(",.0f")(countriesVisitedCount.length))
d3.select(".countriesVisited").text((countriesVisited.join(' | ')))
d3.select(".tuffestDay").text(d3.timeFormat("%a %d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(tuffestDay)))//Calculate date format to timeParse and the to timeFormat Month day
d3.select(".tuffestDayDetails").text((tuffestDayDetails.join(' | ')))
d3.select(".farthestDistance").text((d3.format(",.0f")((farthestDistance))))
d3.select(".farthestDistanceDetails").text((farthestDistanceDetails.join(' | ')))





// Tween animation of numbers
      function tweenText( newValue ) {
         return function() {
           // get current value as starting point for tween animation
           var currentValue = +this.textContent;
           // create interpolator and do not show nasty floating numbers
           var i = d3.interpolateRound( currentValue, newValue );
           return function(t) {
             this.textContent = i(t);
           };
         }
       }

});




//
// Adds the svg canvas
var	chart2 = d3.select("#test")
.append('svg')
.attr('width', width + 'px')
.attr('height', height + 'px')

// Get the data
d3.json('data.json').then(function(data) {
  svg.append('circle')
      .attr('x', 200)
      .attr('y', 200)
      .attr('r', 50)
      .attr('width', 20)
      .attr('height', 20);
        });
