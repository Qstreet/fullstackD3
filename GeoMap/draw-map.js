async function drawDataViz() {

  // IMPORT GeoJSON map data  
  const countryShapes = await d3.json("./ne_50m_admin_0_countries/world-geojson2.json")

  // ACCESSOR FUNCTIONS
  const countryNameAccessor = d => d.properties["NAME"]
  const countryIdAccessor = d => d.properties["ADM0-A3-IS"]

  // VARIABLES
  const metric = "Population growth (annual %)"

  // IMPORT CSV Data
  const dataset = await d3.csv("./data/data_bank_data.csv")

  // Create OBJ for easy lookup of country to pop growth %
  let metricDataByCountry = {}

  // note return is the block to the if conditional
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
// 
const sphere        = ({type: "Sphere"})
const projection    = d3.geoEqualEarth().fitWidth(dimensions.boundedWidth, sphere)
const pathGenerator = d3.geoPath(projection)




  console.log(metricDataByCountry);
}
drawDataViz()

/*
404: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "International tourism, receipts (current US$)", … }

405: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "Net migration", … }

406: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "Population growth (annual %)", … }

407: Object { "Country Name": "Kenya", "Country Code": "KEN", "Series Name": "Population density (people per sq. km of land area)", … }

*/