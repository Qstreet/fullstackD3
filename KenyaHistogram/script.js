async function drawDataViz() {

  // Create parsers to convert dates in ACLED string format into javascript Date object and back into string as needed.
  const dateParser = d3.timeParse('%Y-%m-%d')
  const dateFormat = d3.timeFormat('%Y-%m-%d')

  // Ping ACLED for date of most recent entry. Here it happens to be 14 Sep 2019

  // From this one JSON return (oneRecord), scrape the event_date field as this represents the most recent ACLED entry
  // use &limit=1 to return only one record
  const oneRecord = "https://api.acleddata.com/acled/read?terms=accept&limit=1"

  // call ACLED api for one record. I am using d3.js but any RESTful HTTP api will work.
  const oneRecordJson = await d3.json(oneRecord)

  // scrape JSON for date and parse string into javascript Date object
  const latestDateJS = dateParser(oneRecordJson.data[0].event_date)

  // subtract duration of days counting back from latest date. Here we use 180 days but it could be any number.
  // This call will return all data which falls between the most recent ACLED entry and whatever 180 days before that is.
  const subtractTime = new Date(latestDateJS.setDate(latestDateJS.getDate() - 180))

  // convert earlier date into string object to insert into actual URL string
  const earliestDate = dateFormat(subtractTime)

  // put latestDate back into string
  // const latestDate = dateFormat(latestDateJS)
  latestDate = oneRecordJson.data[0].event_date


  // pick country by ISO list. 404 happens to be Kenya
  const countryISO = 12
  const dateRange = earliestDate + "|" + latestDate
  console.log(dateRange);

  // call ACLED api. Here we are getting all Riots and Protests in Kenya from the latest entry to 180 days back.
  // it seems that you must put the early date first and recent date second


  // const j = `https://api.acleddata.com/acled/read?terms=accept&iso=404&event_type=Protests&event_type=Riots&event_date=${earliestDate}console.log(j);


  // this is the actual string which gets sent to ACLED

  // const jsonData = `https://api.acleddata.com/acled/read?terms=accept&iso=${countryISO}&event_type=Protests&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

  const jsonData = `https://api.acleddata.com/acled/read?terms=accept&iso=${countryISO}&event_type=Protests:OR:event_type=Riots&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

  // const jsonData = `https://api.acleddata.com/acled/read?terms=accept&iso=${countryISO}&event_type=Protests&event_type=Riots&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

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

  // const maxY = datasetByAdmin1.reduce(function(max, p) {
  //   if (p.value > max) {
  //     return p.value
  //   } else {
  //     return max, datasetByAdmin1[0].value
  //   }
  // })

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