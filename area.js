// var workoutsPerWeek = d3.nest()
//     .key(function(d) {return (d3.timeFormat("%a")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
//     // .sortKeys(d3.ascending)
//     .rollup(function (values) {return {
//       count: d3.count(values, function(d) {return d.id;}),
//     }})
//     .entries(data);
//
// console.log(workoutsPerWeek);
//
// var sufferscorePerMonth = d3.nest()
//     .key(function(d) {return (d3.timeFormat("%b")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))})
//         // .sortKeys(d3.ascending)
//     .rollup(function (values) {return {
//         suffer_score: d3.sum(values, function(d) {return d.suffer_score;}),
//     }})
//     .entries(data);
//




var margin = {top: 2, right: 2, bottom: 2, left: 2},
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var area = d3.select(".area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//CHART
          d3.json('data.json').then(function(data) {

            data = data.sort(function(a,b){ //sorting  d.start_date_local
              return a.start_date_local - b.start_date_local;
            });

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
                .domain([new Date (activeYear,00,01), new Date(activeYear,11,31)]) //January = 00
                .nice()
                .range([48+2, 800-48]); //margin + radius circle

            yScale = d3.scaleTime()
            .domain([new Date("2020-01-01 00:00:00"), new Date("2020-01-01 24:00:00")]) //creates 24h range
            .nice()
            .range([48,500-48-2]);

//AREA
area = svg.selectAll('.line')
                .data(data)
                .enter()
                .attr("d", d3.area()
                .xScale(function(d) { return x(d.start_date_local) })
                  .yScale(function(d) { return y(d.distance) })
                  )
                  //




                //     // Add the area
                //     area.append("path")
                //       .datum(data)
                //       .attr("fill", "#55546E")
                //       .attr("stroke", "#fff")
                //       .attr("stroke-width", 1.5)


//
//
//
//
// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
//
//   // When reading the csv, I must format variables:
//   function(d){
//     return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
//   },
//
//   // Now I can use this dataset:
//   function(data) {
//
//     // Add X axis --> it is a date format
//     var x = d3.scaleTime()
//       .domain(d3.extent(data, function(d) { return d.date; }))
//       .range([ 0, width ]);
//     area.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       // .call(d3.axisBottom(x));
//
//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain([0, d3.max(data, function(d) { return +d.value; })])
//       .range([ height, 0 ]);
//     area.append("g")
//       // .call(d3.axisLeft(y));
//
//     // Add the area
//     area.append("path")
//       .datum(data)
//       .attr("fill", "#55546E")
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//       .attr("d", d3.area()
//         .x(function(d) { return x(d.date) })
//         .y0(y(0))
//         .y1(function(d) { return y(d.value) })
//         )
//         //
//     area.append("circle")
//       .datum(data)
//             .enter()
//             .append("path")
//                   .style("fill", (d, i) => '#DBDBDB')
//                   .selectAll("circle")
//                   // .data(d => d.data)
//                   .enter()
//                   .append("g")
//                   .attr("class", "circle")
//                   .append("circle")
//                   .attr('stroke', '#ffffff')
//                   .attr('stroke-width', '100px')
//                   .attr("cx", function(d) {return x(d.date)})
//                   .attr("cy", function(d) {return y(d.value)})
//                   .attr("r", 60)
//                   .style('opacity', 1)
//
// });


//
// d3.json('data.json').then(function(data) {
//
