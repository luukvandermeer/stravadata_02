var margin = 0,
  width = 200,
  height = 150
  barcharts
  // workoutTypeCount = d3.count(data, d => {if (d.type='ride') {return d.id}})

var barcharts = d3.select('.barchart')
  .append('svg')
  .attr('width', width + 'px')
  .attr('height', height + 'px')

d3.json('data.json').then(function(data) {

  xMinMax = d3.extent(data, function(d) {
  });

  yMinMax = d3.extent(data, function(d) {
  });

//ADD SCALE
  xScale = d3.scaleLinear()
      .domain([0,100])
      .range([0,200]);

  yScale = d3.scaleBand()
  .domain([0,150])
  .range([0,150]);


//ADD AXIS
barcharts.selectAll('rect')
.data(data)
.enter()
.append('rect')
.attr('x', 12)
 .attr('y', function(d) { return yScale(d.type); })
 .attr('width', function(d) { return xScale(d.moving_time); })
 .attr('height', 5)
 .attr('fill', '#69b3a2')
 .on('mouseover', function(d){
   console.log(d.type);
});

// barcharts.append('text')
// .attr('class', 'label')
// .attr('y', function (d) {
//       return yScale();
//   })
//   //x position is 3 pixels to the right of the bar
//   .attr('x', function (d) {
//       return xScale(d.moving_time) + 3;
//   })
//   .text(function (d) {
//       return d.moving_time;
//   });



//     barcharts.selectAll('rect')
//       .data(data)
//       .enter()
//       .append('rect')
//       .attr('x', 12)
//       .attr('y', 12)
//       .attr('width', function(d,i) {return d.average_speed})
//       .attr('height', 3)




});
