

var margin = 48,
  width = 800,
  height = 500;

var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + 'px')
  .attr('height', height + 'px')

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

// Add a scale to the fill or stroke of the circles/lines
// cScale = d3.scaleOrdinal()
// .domain([0,1])
// .range(['#333', '#ff6600'])

//ADD AXIS
// xAxis = d3.axisBottom(xScale).tickValues([40,200,300]);
xAxis = d3.axisBottom(xScale)
.tickFormat(d3.timeFormat("%b"))
.ticks(d3.timeMonth.every(1)); //adjust amount of ticks

yAxis = d3.axisLeft(yScale)
.tickFormat(d3.timeFormat("%I%p"))
.ticks(d3.timeHour.every(12));

xAxisG = svg.append('g') //group element xAxis
.attr('id', 'xAxis')
.attr('class', 'xAxis');

yAxisG = svg.append('g') //group element yAxis
.attr('id', 'yAxis')
.attr('class', 'yAxis');

xAxisG.call(xAxis) //syntax to call xAxis
  .attr('transform', 'translate(0,' + (500-48) +')');

yAxisG.call(yAxis) //syntax to call xAxis
.attr('transform', 'translate(48,0)');

//LINES
  lines = svg.selectAll('.line')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'line')
    .attr('x1', function(d) {
        return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('x2', function(d) {
        return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('y1', function(d) {
      return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))))) // uses fixed date and variable HH:MM:SS for yScale
    })
    .attr('y2', function(d) {
      return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(parseFloat(d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))+d.moving_time*1000)))); //calculate d.start_date_local to UNIC EPOCH, add movingtime (milli) seconds, uses fixed date and variable HH:MM:SS for yScale
    })
    .attr('stroke', '#FFF')
    .on('mouseover', function(d){
      console.log(d.start_date_local);
      console.log(d.start_date_local+1);
      console.log(d3.timeHour.offset((d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))), 1));

    });

//CIRCLES
  circlesX1 = svg.selectAll('.circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('cy', function(d) {
    return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))))) // uses fixed date and variable HH:MM:SS for yScale
      // return d.elapsed_time / 1000;
    })
    .attr('r', 1.75)
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', '#55546E');

  circlesX2 = svg.selectAll('.circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('cy', function(d) {
      return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(parseFloat(d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))+d.moving_time*1000)))); //calculate d.start_date_local to UNIC EPOCH, add movingtime (milli) seconds, uses fixed date and variable HH:MM:SS for yScale
    })
    .attr('r', 1.75)
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', '#55546E')
    .on('mouseover', function(d){
      console.log(d.start_date_local+d.moving_time);
    });


    console.log(d3.timeFormat("%H:%M:%S")(parseFloat(d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")("2020-07-24T23:38:40Z")))+1994000));
    console.log(parseFloat(d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")("2020-02-15T01:24:32Z")))+1);
    console.log((d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")("2020-02-15T01:24:32Z")))+1);
    // (d3.timeFormat("%H:%M:%S")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")((d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")("2020-02-15T01:24:32Z")))+(d.elapsed_time*1000))))

    console.log;
    console.log(d3.timeFormat("%s")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")("2020-02-15T01:24:32Z")));
    console.log(d3.timeFormat("%H:%M:%S")(1581726272000));

});
