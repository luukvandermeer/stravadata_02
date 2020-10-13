
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
barsCountWorkouts.selectAll('svg')
.data(arrayWorkoutsPerWeek)
.enter()
.append('rect')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key))+20)
.attr('width', d => width)
.attr('height', 1)
.attr('fill', '#ffffff')

barsCountWorkouts.selectAll('svg')
.data(arrayWorkoutsPerWeek)
.enter()
.append('rect')
.attr('x', function(d) {return (0)})
.attr('y', d => (yScale(d.key)+6))
.attr('width', function(d) { return xScale(d.value.count); })
.attr('height', 14)
.attr('fill', '#ffffff');

//ADD TEXT
barsCountWorkouts.selectAll('text')
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

barsCountWorkouts.selectAll('text1')
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




//
// var margin = {top: 2, right: 2, bottom: 2, left: 2},
//     width = 200 - margin.left - margin.right,
//     height = 200 - margin.top - margin.bottom;
//
// // append the svg object to the body of the page
// var area = d3.select(".area")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// //CHART
//           d3.json('data.json').then(function(data) {
//
//             data = data.sort(function(a,b){ //sorting  d.start_date_local
//               return a.start_date_local - b.start_date_local;
//             });
//
//             activeYear = d3.min(data, function(d){ //determine year
//               return d3.timeFormat("%Y")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local));
//             });
//
//             xMinMax = d3.extent(data, function(d) {
//               // return parseFloat(d3.timeFormat("%j")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))); //calculate first data and last day of excersize
//             });
//
//             yMinMax = d3.extent(data, function(d) {
//               // return parseFloat(d3.timeFormat("%s")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))); //calculate UNIX EPOCH
//             });
//
//
// //ADD SCALE
//             xScale = d3.scaleTime()
//                 .domain([new Date (activeYear,00,01), new Date(activeYear,11,31)]) //January = 00
//                 .nice()
//                 .range([48+2, 800-48]); //margin + radius circle
//
//             yScale = d3.scaleTime()
//             .domain([new Date("2020-01-01 00:00:00"), new Date("2020-01-01 24:00:00")]) //creates 24h range
//             .nice()
//             .range([48,500-48-2]);
//
// //AREA
// area = svg.selectAll('.line')
//                 .data(data)
//                 .enter()
//                 .attr("d", d3.area()
//                 .xScale(function(d) { return x(d.start_date_local) })
//                   .yScale(function(d) { return y(d.distance) })
//                   )
//                   //
