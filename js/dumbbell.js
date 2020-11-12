var margin = 48,
  width = 800,
  height = 400;

var svg = d3.select(".chart")
  .append('svg')
  .attr('width', 760 + 'px') //changed with to remove JAN tick on X axis
  .attr('height', height + 'px')
  .call(d3.zoom().on("zoom", function () {
   svg.attr("transform", d3.event.transform)})
   .scaleExtent([1,10]) //limit amount of zoom
   .translateExtent([[0, 0], [760, height]]))
   .append("g");

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
    .range([margin+2, width-margin]); //margin + radius circle

yScale = d3.scaleTime()
.domain([new Date("2020-01-01 00:00:00"), new Date("2020-01-01 24:00:00")]) //creates 24h range
.nice()
.range([margin,height-margin-2]);

//ADD AXIS
xAxis = d3.axisBottom(xScale)
.tickFormat(d3.timeFormat("%b"))
.ticks(d3.timeMonth.every(1)); //adjust amount of ticks

yAxis = d3.axisLeft(yScale)
.tickFormat(d3.timeFormat("%I%p"))
.ticks(d3.timeHour.every(12));

xAxisG = svg.append('g') //group element xAxis
.attr('id', 'xAxis')
.attr('class', 'xAxis')
;

yAxisG = svg.append('g') //group element yAxis
.attr('id', 'yAxis')
.attr('class', 'yAxis');

xAxisG.call(xAxis) //syntax to call xAxis
  .attr('transform', 'translate(0,' + (height-30) +')')
  .selectAll("text")
    .attr("y", 6)
    .attr("x", 15)
    .style("text-anchor", "start");

yAxisG.call(yAxis) //syntax to call xAxis
.attr('transform', 'translate(48,0)');



/////////////VERTICAL AXIS LINES//////////////////
// // gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(xScale)
        .ticks(11)}

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-(height-margin))
        .tickFormat(""))
    .call(g => g.selectAll(".tick line")
    .attr("stroke-opacity", 0.1)
    .attr("stroke-dasharray", "2,2"))


/////////////SHOW SOME DATA//////////////////
//LINES
  lines = svg.selectAll('lines')
    .data(data)
    .enter()
    .append('line')
    // .attr('class', 'line')
    .attr("class", function(d,i) {return "line" + d.id; })
    .attr('x1', function(d) {
        return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('x2', function(d) {
        return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('y1', height/2)
    .attr('y2', height/2)
    .attr('stroke', '#FFF')
    .attr('stroke-opacity', 0)
    .on("mouseover", createToolTip)
    .on("mouseout", removeToolTip);

linesHover = svg.selectAll('linesHover') //creating array behind line for hover
      .data(data)
      .enter()
      .append('line')
      .attr('x1', function(d) {
          return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
      })
      .attr('x2', function(d) {
          return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
      })
      .attr("y1", 0+margin)
      .attr("y2", height-margin)
      .attr('stroke', '#FCE545')
      .attr('stroke-opacity', 0)
      .on("mouseover", createToolTip)
      .on("mouseout", removeToolTip);

//CIRCLES
  circlesX1 = svg.selectAll('.circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'circle1')
    .attr('cx', function(d) {
      return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('cy', height/2)
    .attr('r', 0)
    .attr('width', 20)
    .attr('height', 20)
    .attr('opacity', 1)
    .style('fill', '#55546E')
    .on("mouseover", createToolTip)
    .on("mouseout", removeToolTip);

circlesX2 = svg.selectAll('circles')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'circle2')
    .attr('cx', function(d) {
      return xScale(new Date(d3.timeFormat("%Y,%m,%d")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))) //calculates which day of the year
    })
    .attr('cy', height/2)
    .attr('r', 0)
    .attr('width', 20)
    .attr('height', 20)
    .attr('opacity', 1)
    .style('fill', '#55546E')
    .on("mouseover", createToolTip)
    .on("mouseout", removeToolTip);

//TOOLTIP
var toolTip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

var hoverLine = svg.append("g")
                .append("line")
                .attr("stroke", "#55546E")
                .style("opacity", 0)
                .style("stroke-dasharray","5,5")
                .attr("y1", 0+margin)
                .attr("y2", height-margin);

function createToolTip (d,i) {
          d3.select(this)
              .style("stroke-width", 4)
              toolTip.transition()
                  .duration(100)
                  .style("opacity", .9);
              toolTip.html((d.name) + "<br/>"  + ((d3.format(",.1f")(d.distance/1000)+"km") + "|" + ((d.total_elevation_gain)+"m")+ "|" + (d3.format(",.1f")(d.moving_time / 3600)+"h") + "|"+(d.suffer_score)+"pt"))
                  .style("left", ((d3.event.pageX)+ 10) + "px")
                  .style("top", ((d3.event.pageY)-15) + "px");
              hoverLine.transition()
                .duration(100)
              .attr("x1", d3.mouse(this)[0])
              .attr("x2", d3.mouse(this)[0])
              .style("opacity", .9);
      }

function removeToolTip (d){
    d3.select(this)
    .style("stroke-width", 1)
      toolTip.transition()
          .duration(300)
          .style("opacity", 0);
      hoverLine.transition()
          .duration(100)
          .style("opacity", 0);
    }
update();
});


function update(d,i){
circlesX1.transition()

  .delay(function(d,i) {return (d.moving_time/2)})
  .duration(1200)
  .attr('r', 1.2)
  .attr('opacity', 1)

  .attr('cy', function(d) {
  return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))))) // uses fixed date and variable HH:MM:SS for yScale
  })
circlesX2.transition()

      .delay(function(d,i) {return (d.moving_time/2)})
    .duration(1200)
    .attr('r', 1.2)
    .attr('opacity', 2)

    .attr('cy', function(d) {
      return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(parseFloat(d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))+d.moving_time*1000)))); //calculate d.start_date_local to UNIC EPOCH, add movingtime (milli) seconds, uses fixed date and variable HH:MM:SS for yScale
    })
lines.transition()

  .delay(function(d,i) {return (d.moving_time/2)})
.duration(1200)

.attr('y1', function(d) {
  return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local))))) // uses fixed date and variable HH:MM:SS for yScale
})
.attr('y2', function(d) {
  return yScale(new Date("2020-01-01 "+(d3.timeFormat("%H:%M:%S")(parseFloat(d3.timeFormat("%Q")(d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d.start_date_local)))+d.moving_time*1000)))); //calculate d.start_date_local to UNIC EPOCH, add movingtime (milli) seconds, uses fixed date and variable HH:MM:SS for yScale
})
.attr('stroke-opacity', 1)
}
