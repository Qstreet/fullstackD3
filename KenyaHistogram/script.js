async function drawDataViz() {

  const dateParser = d3.timeParse('%Y-%m-%d')
  const dateFormat = d3.timeFormat('%Y-%m-%d')

  // Get most recent date and subtrack 90 days
  const oneRecord = "https://api.acleddata.com/acled/read?terms=accept&limit=1"

  const oneRecordJson = await d3.json(oneRecord)
  const latestDate = dateParser(oneRecordJson.data[0].event_date)
  const subtractTime = new Date(latestDate.setDate(latestDate.getDate() - 180))
  const earliestDate = dateFormat(subtractTime)

  const jsonData = `https://api.acleddata.com/acled/read?terms=accept&iso=231&event_type=Protests&event_type=Riots&last_event_date=${earliestDate}|${latestDate}&last_event_date_where=BETWEEN`

  const accessor01 = d => d.admin1

  const dataJson = await d3.json(jsonData)
  const dataset = dataJson.data

  let datasetByAdmin1 = d3.nest()
    .key(function (d) { return d.admin1 })
    .sortKeys(d3.ascending)
    .rollup(function (v) { return v.length })
    .entries(dataset)

  // get max value for Y scale
  const maxY = datasetByAdmin1.reduce((max, p) => p.value > max ? p.value : max, datasetByAdmin1[0].value)

  // for histrogram which should be 2x as wide as tall
  let dimensions = {
    width: window.innerWidth * 0.95,
    height: window.innerWidth * 0.5,
    margin: {
      top: 15,
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
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const yAxisGenerator = d3.axisLeft().scale(yScale)


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