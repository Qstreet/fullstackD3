async function drawDataViz() {

  // IMPORT GeoJSON map data  
  const countryShapes = await d3.json('./ne_50m_admin_0_countries/world-geojson2.json')
  // const countryShapes = await d3.json('./ne_50m_admin_0_countries/ne_50_admin_0-ATA.json')

  // ACCESSOR FUNCTIONS
  const countryNameAccessor = d => d.properties['NAME']
  const countryIdAccessor = d => d.properties['ADM0_A3_IS']

  // VARIABLES
  // metric matches the records from the csv dataset
  const metric = 'Population growth (annual %)'

  // IMPORT CSV Data
  const dataset = await d3.csv('./data/data_bank_data.csv')

  // Create OBJ for easy lookup of country to pop growth %
  // some values will be negative due to population loss
  let metricDataByCountry = {}

  // note return is the block to the if conditional and stops further execution
  dataset.forEach(d => {
    if (d['Series Name'] != metric) return
    metricDataByCountry[d['Country Code']] = +d['2017 [YR2017]'] || 0
  })

  // Dimensions
  let dimensions = {
    width: d3.min([900, window.innerWidth * 0.9]),
    margin: {
      top:    10,
      right:  40,
      bottom: 40,
      left:   40
    }
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

  // PROJECTIONS
  // sphere is a GeoJSON obj like point, multipoint. Sphere has no coordinates
  //  globe projection might be d3.geoTransverseMercator()
  const sphere = ({ type: 'Sphere' })
  const projection = d3.geoOrthographic().fitWidth(dimensions.boundedWidth, sphere).scale(400)
    // const projection = d3.geoTransverseMercator().fitWidth(dimensions.boundedWidth, sphere)

  // pathGenerator acts here as a scale converting a GeoJSON obj into a <path> d string
  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  // y1 represents highest (inverted) dimension of y axis of bounded projection
  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom

  // DRAW CANVAS
  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // Object.values is array of values from key:value of the object metricDataByCountry
  const metricValues = Object.values(metricDataByCountry)
  const metricValuesExtent = d3.extent(metricValues)

  // TK isn't array elem[0] now positive because the lowest half of the extent range is a negative number?
  const maxChange = d3.max([-metricValuesExtent[0], metricValuesExtent[1]])
  const colorScale = d3.scaleLinear()
    .domain([-maxChange, 0, maxChange])
    .range(['indigo', 'white', 'darkgreen'])

  const earth = bounds.append('path')
    .attr('class', 'earth')
    .attr('d', pathGenerator(sphere))

  // GRATICULE
  const graticuleJson = d3.geoGraticule10()

  const graticule = bounds.append('path')
    .attr('class', 'graticule')
    .attr('d', pathGenerator(graticuleJson))

  const countries = bounds.selectAll('.country')
    // bind one elem per item of the dataset
    .data(countryShapes.features)
    .enter()
    // create one new path for each feature set
    .append('path')
    .attr('class', 'country')
    .attr('d', pathGenerator)
    .attr('fill', d => {
      const metricValue = metricDataByCountry[countryIdAccessor(d)]
      if (typeof metricValue == 'undefined') return '#ababab'
      return colorScale(metricValue)
    })

  const legendGroup = wrapper.append('g')
    .attr('transform', `translate(${110}, ${dimensions.width < 800 ? dimensions.boundedHeight - 30 : dimensions.boundedHeight * 0.2})`)

  const legendTitle = legendGroup.append('text')
    .attr('y', -23)
    .attr('class', 'legend-title')
    .text('Population growth')

  const legendByline = legendGroup.append('text')
    .attr('y', -9)
    .attr('class', 'legend-byline')
    .text('Percent change in 2017')

  const defs = wrapper.append('defs')
  const legendGradientId = 'legend-gradient'

  const gradient = defs.append('linearGradient')
    .attr('id', legendGradientId)
    .selectAll('stop')
    .data(colorScale.range())
    .enter().append('stop')
    .attr('stop-color', d => d)
    .attr('offset', (d, i) => `${i * 100 / 2}%`)

  const legendWidth = 120
  const legendHeight = 16
  const legendGradient = legendGroup.append('rect')
    .attr('x', -legendWidth / 2)
    .attr('height', legendHeight)
    .attr('width', legendWidth)
    .style('fill', `url(#${legendGradientId})`)

  const legendValueRight = legendGroup.append('text')
    .attr('class', 'legend-value')
    .attr('x', legendWidth / 2 + 10)
    .attr('y', legendHeight / 2)
    .text(`${d3.format('.1f')(maxChange)}%`)

  const legendValueLeft = legendGroup.append('text')
    .attr('class', 'legend-value')
    .attr('x', -legendWidth / 2 - 10)
    .attr('y', legendHeight / 2)
    .text(`${d3.format('.1f')(maxChange)}%`)
    .style('text-anchor', 'end')

  navigator.geolocation.getCurrentPosition(myPosition => {
    const [x, y] = projection([
      myPosition.coords.longitude,
      myPosition.coords.latitude
    ])

    const myLocation = bounds.append('circle')
      .attr('class', 'my-location')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 0)
      .transition().duration(500)
      .attr('r', 10)
  })

  countries.on('mouseenter', onMouseEnter)
    .on('mouseleave', onMouseLeave)

  const tooltip = d3.select('#tooltip')

  function onMouseEnter(datum) {
    tooltip.style('opacity', 1)

    const metricValue = metricDataByCountry[countryIdAccessor(datum)]

    tooltip.select('#country')
      .text(countryNameAccessor(datum))

    tooltip.select('#value')
      .text(`${d3.format(",.2f")(metricValue || 0)}%`)

    const [centerX, centerY] = pathGenerator.centroid(datum)
    const x = centerX + dimensions.margin.left
    const y = centerY + dimensions.margin.top

  tooltip
    .style('transform', `translate(calc( -50% + ${x}px), calc( -100% + ${y}px))`)
  }

  function onMouseLeave() {
    tooltip.style('opacity', 0)
  }
} // close wrapping fn

drawDataViz()

/*
404: Object { 'Country Name': 'Kenya', 'Country Code': 'KEN', 'Series Name': 'International tourism, receipts (current US$)', … }
405: Object { 'Country Name': 'Kenya', 'Country Code': 'KEN', 'Series Name': 'Net migration', … }
406: Object { 'Country Name': 'Kenya', 'Country Code': 'KEN', 'Series Name': 'Population growth (annual %)', … }
407: Object { 'Country Name': 'Kenya', 'Country Code': 'KEN', 'Series Name': 'Population density (people per sq. km of land area)', … }
*/
