async function drawLineChart() {
  // TIME PARSE and X ACCESSOR
  const dateParser = d3.timeParse("%b-%d-%Y");
  const dateParserUK = d3.timeParse("%d/%m/%Y");
  const timeFormatUK = d3.timeFormat("%b %d, %Y")

  // gridlines in x axis function
  function make_x_gridlines() {
    return xAxisGenerator.ticks(7);
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return yAxisGenerator.ticks(10);
  }

  const dataset = await d3.csv("./KenyaRates1998on.csv", function (d) {
    return {
      date: dateParser(d.Date),
      exchTo1USD: +d.exchTo1USD
    }
  });

  // Second line data
  const datasetUK = await d3.csv("./KenyaUK2004.csv", function (d) {
    return {
      date: dateParserUK(d.Date),
      mean: +d.Mean
    }
  })

  // ACCESSOR fn  convert single data pt into a value
  const yAccessor = dataset => dataset.exchTo1USD;
  const yAccessorUK = datasetUK => datasetUK.mean;
  // accessor fn so that xAccessor(dataset[0]) returns first day date
  // REMEMBER: accessor fns return an unscaled value
  const xAccessor = d => d.date;
  const xAccessorUK = datasetUK => datasetUK.date

  // WRAPPER AND BOUNDS
  let dimensions = {
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.5,
    margin: {
      top: 35,
      right: 35,
      bottom: 50,
      left: 60
    }
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // SCALES
  const yScaleUK = d3
    .scaleLinear()
    .domain([0, d3.max(datasetUK, yAccessorUK)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const yScaleUS = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])


  const xScaleUK = d3
    .scaleTime()
    .domain(d3.extent(datasetUK, xAccessorUK))
    .range([0, dimensions.boundedWidth])



  // FILL COLOR
  const areaUK = d3.area()
    .curve(d3.curveBasis)
    .x(datasetUK => xScaleUK(xAccessorUK(datasetUK)))
    .y0(datasetUK => yScaleUK(yAccessor(datasetUK)))
    .y1(datasetUK => yScaleUK(180))

  bounds.append('path')
    .datum(dataset)
    .attr('fill', 'white')
    .attr('d', areaUK)


  const area = d3.area()
    .curve(d3.curveBasis)
    .x(dataset => xScale(xAccessor(dataset)))
    .y0(dataset => yScaleUS(0))
    .y1(dataset => yScaleUK(yAccessor(dataset)))

  bounds.append('path')
    .datum(dataset)
    .attr('fill', '#eee')
    .attr('d', area)

  const yAxisGenerator = d3.axisLeft().scale(yScaleUS);

  const yAxis = bounds.append("g").call(yAxisGenerator);

  yAxisGenerator(yAxis);

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  // add the X gridlines
  bounds
    .append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + dimensions.boundedHeight + ")")
    .call(
      make_x_gridlines()
        .tickSize(-dimensions.boundedHeight)
        .tickFormat("")
    );


  // add the Y gridlines
  bounds
    .append("g")
    .attr("class", "grid")
    .call(
      make_y_gridlines()
        .tickSize(-dimensions.boundedWidth)
        .tickFormat("")
    );

  const lineGenerator2 = d3
    .line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScaleUK(yAccessorUK(d)));

  const lineGenerator = d3
    .line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScaleUK(yAccessor(d)));

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 0.5);

  bounds.append("text")
    .attr("transform", "translate(" + (dimensions.boundedWidth + 3) + "," + yScaleUS(dataset[0].exchTo1USD) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "blue")
    .text("US$");


  const line2 = bounds
    .append("path")
    .attr("d", lineGenerator2(datasetUK))
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 0.5)

  bounds.append("text")
    .attr("transform", "translate(" + (dimensions.boundedWidth + 3) + "," + yScaleUK(datasetUK[0].mean) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("UK£");


  // add a title
  bounds
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", -8)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8em")
    .style("text-decoration", "none")
    .text("Kenya Shilling Exchange : USD and UK Pound ");

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 5)
    .attr("fill", "black")
    .style("font-size", "1.8em")
    .html("November 2004 to Current");

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 25)
    .attr("fill", "black")
    .style("font-size", "1.8em")
    .text("Kenya Shillings")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");


  // TIMELINE
  bounds.append("line")          // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", xScale(dateParser("Jun-23-2016")))     // x position of the first end of the line
    .attr("y1", dimensions.boundedHeight * .01)      // y position of the first end of the line
    .attr("x2", xScale(dateParser("Jun-23-2016")))
    .attr("y2", dimensions.boundedHeight - 45)
    .attr("stroke-dasharray", "2px 10px")


  bounds.append("text")
    .attr("x", xScale(dateParser("Jun-23-2016")))
    .attr("y", dimensions.boundedHeight - 15)
    .text("Brexit")
    .attr('class', 'timelineLable')
    .style('text-anchor', 'middle')

  bounds.append("line")
    .style("stroke", "black")  // colour the line
    .attr("x1", xScale(dateParser("Dec-27-2007")))
    .attr("y1", dimensions.boundedHeight * .01)
    .attr("x2", xScale(dateParser("Dec-27-2007")))
    .attr("y2", dimensions.boundedHeight - 45)
    .attr("stroke-dasharray", "2px 10px")

  bounds.append("text")
    .attr("x", xScale(dateParser("Dec-27-2007")))
    .attr("y", dimensions.boundedHeight - 15)
    .text("Kibaki elected")
    .attr('class', 'timelineLable')
    .style('text-anchor', 'middle')

  bounds.append("line")
    .style("stroke", "black")  // colour the line
    .attr("x1", xScale(dateParser("Mar-14-2013")))
    .attr("y1", dimensions.boundedHeight * .01)
    .attr("x2", xScale(dateParser("Mar-14-2013")))
    .attr("y2", dimensions.boundedHeight - 45)
    .attr("stroke-dasharray", "2px 10px")

  bounds.append("text")
    .attr("x", xScale(dateParser("Mar-14-2013")))
    .attr("y", dimensions.boundedHeight - 15)
    .text("Kenyatta elected")
    .attr('class', 'timelineLable')
    .style('text-anchor', 'middle')

  bounds.append("line")
    .style("stroke", "black")
    .attr("x1", xScale(dateParser("Aug-08-2017")))
    .attr("y1", dimensions.boundedHeight * .01)
    .attr("x2", xScale(dateParser("Aug-08-2017")))
    .attr("y2", dimensions.boundedHeight - 45)
    .attr("stroke-dasharray", "2px 10px")

  bounds.append("text")
    .attr("x", xScale(dateParser("Aug-08-2017")))
    .attr("y", dimensions.boundedHeight - 15)
    .text("Kenyatta elected")
    .attr('class', 'timelineLable')
    .style('text-anchor', 'middle')

}

drawLineChart();
