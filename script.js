async function drawLineChart() {

  // TIME PARSE and X ACCESSOR
  const dateParser = d3.timeParse('%b-%d-%Y')
  const dateParserUK = d3.timeParse('%d/%m/%Y')

  // gridlines in x axis function
  function make_x_gridlines() {
    return xAxisGenerator.ticks(5)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return yAxisGenerator.ticks(5)
  }

  const dataset = await d3.csv('./KenyaRates1998on.csv', function (d) {
    return {
      date: dateParser(d.Date),
      exchTo1USD: +d.exchTo1USD
    }
  })

  // Second line data
  const datasetUK = await d3.csv('./KenyaUK2004.csv', function (d) {
    return {
      date: dateParserUK(d.Date),
      mean: +d.Mean
    }
  })

  console.log(datasetUK);

  // ACCESSOR fn  convert single data pt into a value
  const yAccessor = d => d.exchTo1USD
  // accessor fn so that xAccessor(dataset[0]) returns first day date
  // REMEMBER: accessor fns return an unscaled value 
  const xAccessor = d => d.date

  // WRAPPER AND BOUNDS
  let dimensions = {
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.5,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper.append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)


  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()






  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append('g')
    .call(yAxisGenerator)

  yAxisGenerator(yAxis)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)



  // add the X gridlines
  bounds.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + dimensions.boundedHeight + ")")
    .call(make_x_gridlines()
      .tickSize(-dimensions.height)
      .tickFormat("")
    )

  // add the Y gridlines
  bounds.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-dimensions.boundedWidth)
      .tickFormat("")
    )


  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append('path')
    .attr('d', lineGenerator(dataset))
    .attr('fill', 'none')
    .attr('stroke', '#af9358')
    .attr('stroke-width', 1)

  // add a title
  bounds.append("text")
    .attr("x", (dimensions.width / 2))
    .attr("y", 6)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "none")
    .text("Kenya Shilling : 1 US Dollar Exchange");

  const xAxisLabel = xAxis.append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 5)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .html("Daily Average: 1998 to Current")

  const yAxisLabel = yAxis.append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 25)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text("Kenya Shillings")
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle')

}

drawLineChart()