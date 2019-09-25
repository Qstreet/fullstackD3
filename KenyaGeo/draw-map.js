async function drawDataViz() {

    // Load GeoJson Shp file
    const countryShapes = await d3.json('./mapData/world-geojson2.json')

    // Load csv data file
    const dataset = await d3.csv('./mapData/data_bank_data.csv')
    // console.log(dataset);

    // ACCESSOR FUNCTIONS
    const countryNameAccessor = d => d.properties["NAME"]
    const countryIdAccessor = d => d.properties["ADM0_A3_IS"]

    // VARIABLES
    const metric = "Population growth (annual %)"

    // OBJECT KEY:countryID VALUE:pop growth
    let metricDataByCountry = {}

    dataset.forEach(d => {
        if (d["Series Name"] != metric) {
            return metricDataByCountry[d["Country Code"]] = +d["2017 [YR2017]"] || 0
        }
    })

    let dimensions = {
        width: window.innerWidth * 0.9,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

    // add sphere to GeoJSON obj. obj already has Point, MultiPoint, Polygon...
    const sphere = ({ type: "Sphere" })

    const projection = d3.geoEqualEarth()
        // .fitWidth() changes default size or range. width in pixels and a GeoJSON obj
        .fitWidth(dimensions.boundedWidth, sphere)

    // same idea as d3.path to create line. returns a <path> d string
    // .bounds(sphere) describes bounding box of GeoJSON obj. returns x,y array
    const pathGenerator = d3.geoPath(projection)
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight
        + dimensions.margin.top
        + dimensions.margin.bottom

    // WRAPPER AND BOUNDS

    const wrapper = d3.select('#wrapper')
        .append('svg')
        .attr('width',  dimensions.width)
        .attr('height', dimensions.height)

    const bounds = wrapper.append('g')
        .style('transform', `translate(${dimensions.margin.left}px,
            ${dimensions.margin.top}px)`)

    // get array of object values
    const metricValues = Object.values(metricDataByCountry)

    // get smallest and largest values
    const metricValueExtent = d3.extent(metricValues)

    // piecewise scale with middle value
    const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]])

    const colorScale = d3.scaleLinear()
        .domain([-maxChange, 0, maxChange])
        .range(["indigo", "white", "darkgreen"])

    // call pathGenerator to draw sphere (earth)
    const earth = bounds.append('path')
        .attr('class', 'earth')
        .attr('d', pathGenerator(sphere))

    // Graticule
    const graticuleJson = d3.geoGraticule10()

    const graticule = bounds.append('path')
        .attr('class', 'graticule')
        .attr('d', pathGenerator(graticuleJson))

    const countries = bounds.selectAll('.country')
        .data(countryShapes.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)  // same as 'd',d => pathGenerator(d)
        .attr('fill', d => {
            const metricValue = metricDataByCountry[countryIdAccessor(d)]
            if (typeof metricValue === "undefined") {
                 return "#e2e6e9"
            }
            return colorScale(metricValue)
        })

    // "Series Name": "Population growth (annual %)"

}
drawDataViz()

/*
"2017 [YR2017]": "2.52311056260112"
​​​"Country Code": "KEN"
​​​"Country Name": "Kenya"
​​​"Series Code": "SP.POP.GROW"
​​​"Series Name": "Population growth (annual %)"

“Transverse Mercator (d3.geoTransverseMercator())
is a good bet for showing maps that cover one country or smaller.
The Winkel Tripel (d3.geoWinkel3()) or Equal Earth (d3.geoEqualEarth())
are good bets for maps covering larger areas, such as the whole world.”

*/