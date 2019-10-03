// function getNumberDays() {
//   var verNumOfDays = document.querySelector("#numOfDays")
//   if (verNumOfDays.value !== 21) {
//     return verNumOfDays.value
//   }
// }


async function drawDataViz() {

  // Create parsers to convert dates in ACLED string format into javascript Date object and back into string as needed.
  const dateParser = d3.timeParse('%Y-%m-%d')
  const formatTime = d3.timeFormat('%Y-%m-%d')

  var verNumOfDays = document.querySelector("#numOfDays")
  var inputField = document.querySelector('input[type="submit"]')

  // var ndays = document.querySelector('#numOfDays').value

  let acledMetrics = {
    countryISO: 108,
    numberOfDays: 21
  }

  d3.select(inputField).on('click', function(evt){
    evt.preventDefault()
    acledMetrics.numberOfDays = inputField.value
    return true
  })

  const oneRecord = `https://api.acleddata.com/acled/read?terms=accept&limit=1&iso=${acledMetrics.countryISO}&event_type=Protests:OR:event_type=Riots:OR:event_type=Violence_against_civilians`

  const oneRecordJson = await d3.json(oneRecord)

  const latestDateJS = dateParser(oneRecordJson.data[0].event_date)

  const subtractTime = new Date(latestDateJS.setDate(latestDateJS.getDate() - acledMetrics.numberOfDays))
  
  const earliestDate = formatTime(subtractTime)

  latestDate = oneRecordJson.data[0].event_date

  const dateRange = earliestDate + "|" + latestDate

  const jsonData = `https://api.acleddata.com/acled/read?terms=accept&iso=${acledMetrics.countryISO}&event_type=Protests:OR:event_type=Riots:OR:event_type=Violence_against_civilians&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

  const accessor01 = d => d.admin1

  const dataJson = await d3.json(jsonData)

  const dataset = dataJson.data
  const countryAccessor = dataset[0].country

  let datasetByAdmin1 = d3.nest()
    .key(function (d) { return d.admin1 })
    .sortKeys(d3.ascending)
    .rollup(function (v) { return v.length })
    .entries(dataset)

  // get max value for Y scale
  const maxY = datasetByAdmin1.reduce((max, p) => p.value > max ? p.value : max, datasetByAdmin1[0].value)

  // for histrogram which should be 2x as wide as tall
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: window.innerWidth * 0.5,
    margin: {
      top: 30,
      right: 15,
      bottom: 90,
      left: 60
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

  const xScale = d3.scaleBand()
    .domain(datasetByAdmin1.map(function (d) { return d.key }))
    .range([0, dimensions.boundedWidth])
    .paddingInner(0.2)
    .paddingOuter(0.1)

  const yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([dimensions.boundedHeight, 0])
    .nice()

  let bars = bounds.selectAll('rect')
    .data(datasetByAdmin1)

  bars.enter()
    .append('rect')
    .attr('y', function (d) { return yScale(d.value) })
    .attr('x', function (d) { return xScale(d.key) })
    .attr('width', xScale.bandwidth)
    .attr('height', function (d) { return dimensions.boundedHeight - yScale(d.value) })
    .attr('fill', 'steelblue')

  // AXES
  // trick here was to put .ticks(maxY) so the axes adjusts each render. Otherwise it renders 1, 1.5, 2, 2.5 ... 
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const yAxisGenerator = d3.axisLeft().ticks(maxY).tickFormat(d3.format("d")).scale(yScale)


  // Rotate X Axes lables
  // Add the X Axis
  const xAxis = bounds.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + dimensions.boundedHeight + ")")
    .call(xAxisGenerator)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-65)"
    })

  const yAxis = bounds.append('g')
    .call(yAxisGenerator)

  bounds.append('text')
    .attr('x', dimensions.width / 2)
    .attr('y', -10)
    .text(`${countryAccessor}: ${earliestDate} to ${latestDate} (${acledMetrics.numberOfDays} Days)`)
    .attr('class', "dateText")
    .attr('text-anchor', 'middle')

  // var verNumOfDays = document.querySelector("#numOfDays")
  // var inputField = document.querySelector('input[type="submit"]')

  // d3.select('input[type = "submit"]')
  //   .on('click', function(){
  //     const vdays = verNumOfDays.value
  //     update(vdays)       
  //   })

}

drawDataViz()
/*
actor1: "Rioters (Kenya)"
actor2: ""
admin1: "Garissa"
admin2: "Dujis"
admin3: "Iftin"
assoc_actor_1: ""
assoc_actor_2: ""
country: "Kenya"
data_id: "5726048"
event_date: "2019-08-02"
event_id_cnty: "KEN6919"
event_id_no_cnty: "6919"
event_type: "Riots"
fatalities: "0"
geo_precision: "1"
inter1: "5"
inter2: "0"
interaction: "50"
iso: "404"
iso3: "KEN"
latitude: "-0.4536"
location: "Garissa"
longitude: "39.6461"
notes: "02 Aug: Residents of Garissa barricaded the road by setting fires on the road demonstrating against the death of the man in the military camp by a member of Kenyan military forces. [size=no report]"
region: "Eastern Africa"
source: "Kenya Standard"
source_scale: "National"
sub_event_type: "Violent demonstration"
time_precision: "1"
timestamp: "1567450154"
year: "2019"
*/