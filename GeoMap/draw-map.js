async function drawDataViz() {

  // IMPORT GeoJSON map data  
  const countryShapes = await d3.json("./ne_50m_admin_0_countries/world-geojson2.json")

  // ACCESSOR FUNCTIONS
  const countryNameAccessor = d => d.properties["NAME"]
  const countryIdAccessor = d => d.properties["ADM0-A3-IS"]

  // VARIABLES
  // metric matches the records from the csv dataset
  const metric = "Population growth (annual %)"

  // IMPORT CSV Data
  const dataset = await d3.csv("./data/data_bank_data.csv")

  // Create OBJ for easy lookup of country to pop growth %
  // some values will be negative due to population loss
  let metricDataByCountry = {}

  // note return is the block to the if conditional and stops further execution
  dataset.forEach(d => {
    if (d["Series Name"] != metric) return
    metricDataByCountry[d["Country Code"]] = +d["2017 [YR2017]"] || 0
  })

  // Dimensions
  let dimensions = {
    width: d3.min([900, window.innerWidth * 0.9]),
    margin: {
      top: 10,
      right: 40,
      bottom: 40,
      left: 40
    }
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

  // PROJECTIONS
  // sphere is a GeoJSON obj like point, multipoint. Sphere has no coordinates
  //  globe projection might be d3.geoTransverseMercator()
  const sphere = ({ type: "Sphere" })
  const projection = d3.geoEqualEarth().fitWidth(dimensions.boundedWidth, sphere)
  // const projection = d3.geoTransverseMercator().fitWidth(dimensions.boundedWidth, sphere)
  // pathGenerator acts here as a scale converting a GeoJSON obj into a <path> d string
  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  // y1 represents highest (inverted) dimension of y axis of bounded projection
  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom

  // DRAW CANVAS
  const wrapper = d3.select("#wrapper")
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
    .range(["indigo", "white", "darkgreen"])

  const earth = bounds.append('path')
    .attr('class', 'earth')
    .attr('d', pathGenerator(sphere))

  // GRATICULE
  const graticuleJson = d3.geoGraticule10()

  const graticule = bounds.append('path')
    .attr('class', 'graticule')
    .attr('d', pathGenerator(graticuleJson))





  console.log({ metricValues });
}
drawDataViz()

/*
404: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "International tourism, receipts (current US$)", … }

405: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "Net migration", … }

406: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "Population growth (annual %)", … }

407: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "Population density (people per sq. km of land area)", … }

*/