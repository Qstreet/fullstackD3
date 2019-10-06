async function drawDataViz() {

const dateParser = d3.timeParse('%Y-%m-%d')
const formatTime = d3.timeFormat('%Y-%m-%d')

const countryISO = 404

// ACCESSOR FUNCTIONS
const accessor_event_date = d => d.event_date

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


/**************************************************/
/****  Updating code start    *********************/
/**************************************************/

async function update(daysBack) {

  const oneRecord = `https://api.acleddata.com/acled/read?terms=accept&limit=1&iso=${countryISO}&event_type=Protests:OR:event_type=Riots:OR:event_type=Violence_against_civilians`

  const oneRecordJson = await d3.json(oneRecord)

  const latestDateJS = dateParser(oneRecordJson.data[0].event_date)

  const subtractTime = new Date(latestDateJS.setDate(latestDateJS.getDate() - daysBack))

  const earliestDate = formatTime(subtractTime)

  const latestDate = oneRecordJson.data[0].event_date

  const dateRange = earliestDate + "|" + latestDate

  const jsonURL = `https://api.acleddata.com/acled/read?terms=accept&iso=${countryISO}&event_type=Protests:OR:event_type=Riots:OR:event_type=Violence_against_civilians&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

  const jsonData = await d3.json('./data.json')
  // console.log(jsonData);
  const dataset = jsonData.data
  // console.log(dataset);

  var nested_data = d3.nest()
    .key(function (d) { return d.admin1; })
    // .key(function (d) { return d.event_type; }).sortKeys(function (d) { return })
    // .rollup(function (leaves) { return leaves.length; })
    .entries(dataset);

  console.log(nested_data);
  // console.log(nested_data[2].values[2]);


  // get array of all event_types in set
  const listEventTypes = dataset.map(function (d) {
    return d.event_type
  })
  // ES6 Set stores unique values of event_types
  const uniqueEventTypes = [...new Set(listEventTypes)]

  // get array of all admin1 in set
  const listAdmin1s = dataset.map(function (d) {
    return d.admin1
  })
  // ES6 Set stores unique values of event_types
  const uniqueAdmin1s = [...new Set(listAdmin1s)]

  // Add X axis
  var xAxis = d3.scaleBand()
    .domain(uniqueAdmin1s)
    .range([0, dimensions.boundedWidth])
    .padding([0.2])

  bounds.append("g")
    .attr("transform", "translate(0," + dimensions.boundedHeight + ")")
    .call(d3.axisBottom(xAxis).tickSizeOuter(0));

  // Add Y axis
  var yAxis = d3.scaleLinear()
    .domain([0, 10])
    .range([dimensions.boundedHeight, 0]);

  bounds.append("g")
    .call(d3.axisLeft(yAxis));

  // color palette = one color per subgroup
  const colorBars = d3.scaleOrdinal()
    .domain(listEventTypes)
    .range(['#e41a1c', '#377eb8', '#4daf4a'])

  //stack the data? --> stack per subgroup
  const stack = d3.stack()
    .keys(listEventTypes)

  let series = [
    [[0, 2], [0, 1], [0, 2]],
    [[1, 0], [1, 4], [1, 3]],
    [[2, 3], [2, 2], [2, 2]]
  ]




  let b = bounds.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(series)
    .enter().append("g")
    .attr("fill", "red")

  b.selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("x", function (d, i) { return xAxis(i); })
    .attr("y", function (d) { return yAxis(d[0]); })
    .attr("height", function (d) { return yAxis(d[0]) - yAxis(d[1]); })
    .attr("width", xAxis.bandwidth())

}

// Initialize
update(14);

// d3.select("#idDaysBack").on('input', function () {
//   update(+this.value)
// })
}

drawDataViz();
