(function () {
  "use strict";

  /*
  async
  before a function means that function always returns a promise.
  Even If a function actually returns a non-promise value, putting “async” in front
  directs JavaScript to automatically wrap that value in a resolved promise.
  
  await
  keyword pauses the execution of a function until a Promise is resolved.
  This only works within function preceded by async

  means that any code (within the function) after await will wait to run until after dataset is defined. 
  
  npm install g live-server
  run live-server in the root /code

  dark sky api
  https://darksky.net/dev/docs#overview

  the wrapper wraps around the bounds

  */

  async function drawLineChart() {

    const dataset = await d3.json("./my_weather_data.json")
    const dateParser = d3.timeParse("%Y-%m-%d")


    /* ACCESSOR FUNCTIONS
    *********************/
    const xAccessor = d => dateParser(d.date)
    const yAccessor = d => d.temperatureMax;

    // define dimension obj in css order
    let dimensions = {
      width: window.innerWidth * 0.8,
      height: 800,
      margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60
      }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // SET OUTER WRAPPER
    const wrapper = d3.select("#wrapper").append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    // SET INNER BOUNDS
    const bounds = wrapper
      .append('g')
      .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    // SCALES 
    const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0]);

    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth])

    // DATA

    const freezingTemperaturePlacement = yScale(32)
    const freezingTemperatures = bounds.append('rect')
      .attr('x', 0)
      .attr('width', dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr('fill', 'aliceblue')

    // LINE

    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    const line = bounds.append('path')
      .attr('d', lineGenerator(dataset))
      .attr('fill', 'none')
      .attr('stroke', "#af9358")
      .attr('stroke-width', 2)

    /* AXES
    note translateY css function (.style)
    ************/
    const yAxisGenerator = d3.axisLeft().scale(yScale)
    const yAxis = bounds.append("g").call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom().scale(xScale)
    const xAxis = bounds.append("g").call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  }

  drawLineChart();

})();
