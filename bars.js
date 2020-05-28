var margin = 0,
  width = 200,
  height = 150
  barcharts
  // workoutTypeCount = d3.count(data, d => {if (d.type="ride") {return d.id}})

var barcharts = d3.select('.barchart')
  .append('svg')
  .attr('width', width + 'px')
  .attr('height', height + 'px')

d3.json('data.json').then(function(data) {
    barcharts.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 12)
      .attr('y', 12)
      .attr('width', function(d,i) {return d.average_speed})
      .attr('height', 3)
  // barcharts.selectAll('.dot')
  //   .data(data)
  //   .enter()
  //   .append('circle')
  //   .attr('class','.dot')
  //   .attr('cx', 100)
  //   .attr('cy', 100)
  //   .attr('r', 5)
  //   .attr('fill', '#000')
  //   .call(xAxis)
});
