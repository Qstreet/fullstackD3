// arable land area per 1000 hectares
// tot pop per 1000 inhab
// % of irrig potential equipped for irrigation
// Tanzania, United Republic of 	TZ 	TZA 	834

async function drawDataViz() {

  // Create parsers to convert dates in ACLED string format into javascript Date object and back into string as needed.
  const dateParser = d3.timeParse('%Y')
  const formatTime = d3.timeFormat('%Y-%m-%d')

  const metrics = ["Arable Land", "Population"]

  const countryISO = 834

  // ACCESSOR FUNCTIONS
  const xAccessor = d => dateParser(d.Year)
  const accessor_arableLand = d => +d.ArableLandArea
  const accessor_totPop = d => +d.TotalPop
  const accessor_pctIrrig = d => +d.pctIrrigPotentEquipForIrrig

  var color = d3.scaleOrdinal()
    .range(['orange', 'steelblue']);


  let dimensions = {
    width: window.innerWidth * 0.8,
    height: window.innerWidth * 0.5,
    margin: {
      top: 30,
      right: 70,
      bottom: 60,
      left: 80
    }
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // DRAW CANVAS
  const wrapper = d3.select("#wrapper")
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)


    function make_x_gridlines() {		
      return d3.axisBottom(xScale)
          .ticks(5)
  }
  
  // gridlines in y axis function
  function make_y_gridlines() {		
      return d3.axisLeft(yScale)
          .ticks(5)
  }



  const dataset = await d3.csv('./tzaData.csv')

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, accessor_totPop)])
    .range([dimensions.boundedHeight, 0])

  const yScale2 = d3.scaleLinear()
    .domain([0, d3.max(dataset, accessor_arableLand)])
    .range([dimensions.boundedHeight, 0])


  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])


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

  const lineGenerator = d3.line()
    .curve(d3.curveBasis)
    .y(d => yScale(accessor_totPop(d)))
    .x(d => xScale(xAccessor(d)))

  const lineGenerator2 = d3.line()
    .curve(d3.curveBasis)
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale2(accessor_arableLand(d)))

  const line = bounds.append('path')
    .attr('d', lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)

  const line2 = bounds.append('path')
    .attr('d', lineGenerator2(dataset))
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2)
    .style("stroke-dasharray", ("3, 3"))

  const yAxisGenerator = d3.axisLeft().scale(yScale)

  const yAxis = bounds.append('g')
    .call(yAxisGenerator)

  const yAxisGenerator2 = d3.axisRight().scale(yScale2)
  const yAxis2 = bounds.append('g')
    .call(yAxisGenerator2)
    .style('transform', `translateX(${dimensions.boundedWidth}px)`)

  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const xAxis = bounds.append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)

  const lableLeft = bounds.append('g')
  const lableRight = bounds.append('g')
  const lableBottom = bounds.append('g')
  const lableMain = bounds.append('g')
  const legendGroup = bounds.append('g')

  lableLeft.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -70)
    .attr("x", 0 - (dimensions.boundedHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Population per 1000 inhabitants")

  lableRight.append("text")
    .attr("transform", "rotate(90)")
    .attr("y", 0 - (dimensions.boundedWidth + 70))
    .attr("x", dimensions.boundedHeight / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Arable Land per 1000 hectars")

  lableBottom.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", dimensions.boundedHeight + 20)
    .attr("x", dimensions.boundedWidth / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Year")

  lableMain.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", 35)
    .attr("x", dimensions.boundedWidth / 2)
    .attr('class', 'header')
    .style("text-anchor", "middle")
    .text("Tanzania: Arable Land vs Population Growth")

  const legendElements = bounds.selectAll('rect')
    .data(metrics)
    .enter()
    .append("rect")

  legendElements.attr('x', function (d, i) {
    return 85
  })
    .attr('y', function (d, i) {
      return (i * 20 + 80)
    })
    .attr('width', "10")
    .attr('height', '3')
    .attr('fill', function (d) {
      return color(d)
    })
    
    lableMain.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", 86)
    .attr("x", 109)
    .attr('class', 'legend')
    .text("Arable Land")

    lableMain.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", 106)
    .attr("x", 109)
    .attr('class', 'legend')
    .text("Population")



  console.log(dataset);


}

drawDataViz();