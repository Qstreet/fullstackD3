(function () {
  "use strict";

  async function draw() {

    const dataset = await d3.json('./my_weather_data.json')


    // ACCESSOR FUNCTIONS
    // EUREKA d is a parameter so we call it thus: xAccessor(d)
    const xAccessor = d => d.dewPoint
    const yAccessor = d => d.humidity
    const colorAccessor = d => d.cloudCover

    // DIMENSIONS

    // set width to smaller of two dimensions of innerWidth/innerHeight
    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

    let dimensions = {
      width: window.innerWidth * 0.8,
      height: width * 0.6,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
      }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // CHART AREA    
    const wrapper = d3.select("#wrapper").append("svg")
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    const bounds = wrapper.append('g')
      .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`)

    // SCALES
    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice()

    const colorScale = d3.scaleLinear()
      .domain(d3.extent(dataset, colorAccessor))
      .range(['skyblue', 'darkslategrey'])

    // AXES
    const xAxisGenerator = d3.axisBottom().scale(xScale)
    const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4)

    const xAxis = bounds.append('g')
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const yAxis = bounds.append('g')
      .call(yAxisGenerator)

    // LABELS

    const xAxisLabel = xAxis.append('text')
      .attr('x', dimensions.boundedWidth / 2)
      .attr('y', dimensions.margin.bottom - 10)
      .attr('fill', 'black')
      .style('font-size', '1.4em')
      .html("Dew point (&deg;f)")

    const yAxisLabel = yAxis.append('text')
      .attr('x', -dimensions.boundedHeight / 2)
      .attr('y', -dimensions.margin.left + 20)
      .attr('fill', 'black')
      .style('font-size', '1.4em')
      .html("Relative Humidity")
      .style('transform', 'rotate(-90deg)')
      .style('text-anchor', 'middle')

    // DRAW CIRCLES

    const circles = bounds.selectAll('circle').data(dataset)

    circles
      .enter()
      .append('circle')
      .attr('cx', function (d) { return xScale(xAccessor(d)) })
      .attr('cy', function (d) { return yScale(yAccessor(d)) })
      .attr('r', 5)
      .attr('fill', function (d) { return colorScale(colorAccessor(d)) })
      .attr('opacity', 0.7)



    console.log(yScale(0.6));
  }
  draw()

})();