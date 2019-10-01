async function drawScatterPlot() {

  const dataset = await d3.csv('./giniMedianAge.csv', function (d) {
    return {
      country: d.country,
      medianAge: +d.medianAge,
      gini: +d.gini
    }
  })

  const yAccessor = d => d.medianAge
  const xAccessor = d => d.gini

  // TOOLTIP
  // var formatTime = d3.timeFormat("%e %B");
  let div = d3.select("body").append("div")
    // .attr("class", "tooltip")
    .style("opacity", 0);

  // TRANSITION
  const t = d3.transition()
    .duration(500)
    .ease(d3.easeLinear);

  // gridlines in x axis function
  function make_x_gridlines() {
    return xAxisGenerator.ticks(7)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return yAxisGenerator.ticks(10)
  }


  // find the SMALLER of H / W
  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9
  ])

  // assign both H/W to that smaller dimension
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 20,
      bottom: 40,
      left: 50,
      right: 10
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper.append('g')
    .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`)

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([dimensions.boundedWidth, 0])
    .nice()

  // reverse y scale to but low numbers (good) high on the chart
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()


  // AXES
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const yAxisGenerator = d3.axisLeft().scale(yScale)

  const xAxis = bounds.append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)

  const yAxis = bounds.append('g')
    .call(yAxisGenerator)

  // add the X gridlines
  bounds.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + dimensions.boundedHeight + ")")
    .call(make_x_gridlines()
      .tickSize(-dimensions.boundedHeight)
      .tickFormat("")
    )

  // add the Y gridlines
  bounds.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-dimensions.boundedWidth)
      .tickFormat("")
    )

  // Color scale
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range(["black", "teal"])

  function drawDotsWave(dataset) {

    const dots = bounds.selectAll('circle')
      .data(dataset)
    // .enter()
    // .append('circle')
    dots.join('circle')
      .attr('cx', d => xScale(xAccessor(d)))
      .attr('cy', d => yScale(yAccessor(d)))
      .attr('r', 5)
      .style('fill', d => colorScale(xAccessor(d)))
      .on("mouseover", function (d) {
        div
        .attr("class", "tooltip")
        .transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`${d.country} <br/> Age: ${d.medianAge} <br/> Gini: ${d.gini}`)
          .style("left", (d3.event.pageX + 8) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(1000)
          .style("opacity", 0);
      });

  }

  setTimeout(() => {
    drawDotsWave(dataset.slice(0, dataset.length)
    )
  }, 1000)

  console.log(dataset.length);

  // function drawDots(dataset, color) {
  //   const dots = bounds.selectAll('circle').data(dataset)

  //   dots
  //     // .enter().append('circle')
  //     // .merge(dots)
  //     .join('circle')
  //     .attr('cx', d => xScale(xAccessor(d)))
  //     .attr('cy', d => yScale(yAccessor(d)))
  //     .attr('r',5)
  //     .attr('fill', color)

  // }
  // drawDots(dataset.slice(0,10), 'darkgrey')

  // setTimeout(() => {
  //   drawDots(dataset, "cornflowerblue")
  // },3500)


  // LABLES
  const xAxisLable = xAxis.append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .html('GINI Index Measure of Income Inequality')

  // REMBER Y lable is turned sideways. 
  const yAxisLable = yAxis.append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 20)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle')
    .text('Median Age')

}

drawScatterPlot()