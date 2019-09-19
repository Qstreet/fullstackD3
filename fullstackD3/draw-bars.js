(function () {
  "use strict";

  async function drawBars() {

    // ACCESS DATA
    const dataset = await d3.json('./my_weather_data.json')

    // DIMENSIONS
    const dimensions = {
      width: window.innerWidth * 0.45,
      margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50
      }
    }
    // put height outside as obj must be declared first
    dimensions.height = dimensions.width * 0.6

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const drawHistogram = metric => {
      // ACCESSOR FUNCTIONS
      const metricAccessor = d => d[metric]
      const yAccessor = d => d.length

      // OUTER WRAPPER
      const wrapper = d3.select("#wrapper").append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

      // INNER BOUNDS
      const bounds = wrapper.append('g')
        .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`)

      // MAKE  TABS CYCLE and WAI-ARIA
      wrapper.attr('role', 'figure')
        .attr('tabindex', "0")
        .append('title')
        .text('Histogram looking at the distro of humidity in 2016')

      // SCALES
      const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, metricAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()

      const binsGenerator = d3.histogram()
        .domain(xScale.domain())
        .value(metricAccessor)
        .thresholds(12)

      const bins = binsGenerator(dataset)

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHeight, 0])

      // RECTS
      const binsGroup = bounds.append('g')
        .attr('tabindex', '0')
        .attr('role', 'list')
        .attr('aria-label', 'histogram bars')


      const binsGroups = binsGroup.selectAll('g').data(bins).enter().append('g')
        .attr("tabindex", "0")
        .attr("role", "listitem")
        .attr("aria-label", d => `There were ${
          yAccessor(d)
          } days between ${
          d.x0.toString().slice(0, 4)
          } and ${
          d.x1.toString().slice(0, 4)
          } humidity levels.`)


      const barPadding = 1

      const barRects = binsGroups.append('rect')
        .attr('x', d => xScale(d.x0) + barPadding / 2)
        .attr('y', d => yScale(yAccessor(d)))
        .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
        .attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr('fill', 'cornflowerblue')

      // AXES
      const xAccessGenerator = d3.axisBottom().scale(xScale)

      const xAxis = bounds.append('g')
        .call(xAccessGenerator)
        .style('transform', `translateY(${dimensions.boundedHeight}px)`)

      // LABELS
      const barText = binsGroups.filter(yAccessor).append('text')
        .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr("y", d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .style('text-anchor', 'middle')
        .attr('fill', 'dargrey')
        .style('font-size', "12px")
        .style('font-family', 'sans-serif')

      const xAxisLabel = xAxis.append('text')
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .text(metric)

      // MEAN LINE
      const mean = d3.mean(dataset, metricAccessor)

      const meanLine = bounds.append('line')
        .attr('x1', xScale(mean))
        .attr('x2', xScale(mean))
        .attr('y1', -15)
        .attr('y2', dimensions.boundedHeight)
        .attr('stroke', 'maroon')
        .attr('stroke-dasharray', '2px 4px')

      const meanLabel = bounds.append("text")
        .attr("x", xScale(mean))
        .attr("y", -20)
        .text(`mean: ${d3.format(".2")(mean)}`)
        .attr("fill", "maroon")
        .style("font-size", "12px")

      wrapper.selectAll("text")
        .attr("role", "presentation")
        .attr("aria-hidden", "true")
    }

    const metrics = [
      "windSpeed",
      "moonPhase",
      "dewPoint",
      "humidity",
      "uvIndex",
      "windBearing",
      "temperatureMin",
      "temperatureMax"
    ]
    metrics.forEach(drawHistogram)

  }  // close asynch function drawBars
  drawBars()

})();