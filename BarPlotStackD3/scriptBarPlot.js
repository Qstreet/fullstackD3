async function drawDataViz() {

  // Create parsers to convert dates in ACLED string format into javascript Date object and back into string as needed.
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

  // const xScale = d3.scaleBand()
  //   .range([0, dimensions.boundedWidth])
  //   .paddingInner(0.2)
  //   .paddingOuter(0.1)

  // const yScale = d3.scaleLinear()
  //   .range([dimensions.boundedHeight, 0])
  //   .nice()

  // // Rotate X Axes lables
  // // Add the X Axis
  // const xAxisGroup = bounds.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + dimensions.boundedHeight + ")")

  // const yAxisGroup = bounds.append('g')

  // const lableGroup = bounds.append('text')
  //   .attr('x', dimensions.width / 2)
  //   .attr('y', -10)


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

    const jsonData = await d3.json(jsonURL)
    const dataset = jsonData.data

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

    // let series = stack(dataset)

    // for (var i = 0; i < series.length; i++) {
    //   var oneEvent = series[i];
    //   for (var j = 0; j < oneEvent.length; j++) {
    //     var twoEvent = oneEvent[j];
    //     for (var k = 0; k < twoEvent.length; k++) {
    //       twoEvent[1] = 1
    //     }
    //   }
    // }

    let series = [
      [[0,2],[0,1],[0,2]],
      [[1,0],[1,4],[1,3]],
      [[2,3],[2,2],[2,2]]
    ]

       console.log(listEventTypes);
    console.log(series);

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
      .attr("x", function (d,i) { return xAxis(i); })
      .attr("y", function (d) { return yAxis(d[0]); })
      .attr("height", function (d) { return yAxis(d[0]) - yAxis(d[1]); })
      .attr("width", xAxis.bandwidth())

    // series.forEach( function(d) {
    //   return d[1] = 1
    // })

 






    // let datasetByAdmin1 = d3.nest()
    //   .key(function (d) { return d.admin1 })
    //   .key(function (d) { return d.event_type })
    //   .sortKeys(d3.ascending)
    //   .rollup(function (leaves) { return leaves.length })
    //   .entries(dataset)
    // console.log(datasetByAdmin1);

    // // let datasetByAdmin1 = d3.nest()
    // //   .key(function (d) { return d.admin1 })
    // //   .sortKeys(d3.ascending)
    // //   .rollup(function (v) { return v.length })
    // //   .entries(dataset)

    // // get max value for Y scale
    // // const maxY = datasetByAdmin1.reduce((max, p) => p.value > max ? p.value : max, datasetByAdmin1[0].value)

    // const maxY = datasetByAdmin1.reduce((max, p) => p.values.length > max ? p.values.length : max, datasetByAdmin1.values.length)

    // xScale.domain(datasetByAdmin1.map(function (d) { return d.key }))

    // yScale.domain([0, maxY])

    // let bars = bounds.selectAll('rect')
    //   .data(datasetByAdmin1)
    // // console.log(datasetByAdmin1);

    // let groupie = d3.map(datasetByAdmin1, function (d) {
    //   return (d.values).keys
    // })

    // console.log(groupie);

    // bars.enter()
    //   .append('rect')
    //   .merge(bars)
    //   .transition() // and apply changes to all of them
    //   .duration(1000)
    //   .attr('y', function (d) { return yScale(d.values.length) })
    //   .attr('x', function (d) { return xScale(d.key) })
    //   .attr('width', xScale.bandwidth)
    //   .attr('height', function (d) { return dimensions.boundedHeight - yScale(d.values.length) })
    //   // .attr('height', function (d) { return dimensions.boundedHeight - yScale(d.value) })
    //   // .attr('fill', 'steelblue')
    //   .attr('fill', function (d) {
    //     if (d.values[0].key === "Protests") {
    //       return "brown"
    //     } else if (d.values[0].key === "null") {
    //       return "green"
    //     } else if (d.values[0].key === "Violence against civilians") {
    //       return "blue"
    //     } else if (d.values[0].key === "Riots") {
    //       return "orange"
    //     } else { return "gold" }
    //   })

    // bars
    //   .exit()
    //   .remove()

    // // AXES
    // // trick here was to put .ticks(maxY) so the axes adjusts each render. Otherwise it renders 1, 1.5, 2, 2.5 ... 

    // const xAxisGenerator = d3.axisBottom().scale(xScale)

    // xAxisGroup.call(xAxisGenerator)
    //   .selectAll("text")
    //   .style("text-anchor", "end")
    //   .attr("dx", "-.8em")
    //   .attr("dy", ".15em")
    //   .attr("transform", function (d) {
    //     return "rotate(-65)"
    //   })



    // const yAxisGenerator = d3.axisLeft()
    //   .ticks(maxY)
    //   .tickFormat(d3.format("d"))
    //   .scale(yScale)

    // yAxisGroup
    //   .call(yAxisGenerator)

    // lableGroup
    //   .text(`${countryAccessor}: ${earliestDate} to ${latestDate} (${daysBack} Days)`)
    //   .attr('class', "dateText")
    //   .attr('text-anchor', 'middle')

  }

  // Initialize
  update(14);

  d3.select("#idDaysBack").on('input', function () {
    update(+this.value)
  })

  // pick country by ISO list. 404 happens to be Kenya
  // const countryISO = '180'
  // const numberOfDays = 45
  // for histrogram which should be 2x as wide as tall


}

drawDataViz();


    //  const accessors = {
    //   actor1: actor1,
    //   actor2: actor2,
    //   admin1: admin1,
    //   admin2: admin2,
    //   admin3: admin3,
    //   assoc_actor_1: assoc_actor_1,
    //   assoc_actor_2: assoc_actor_2,
    //   country: country,
    //   data_id: +data_id,
    //   event_date: dateParser(event_date),
    //   event_type: event_type,
    //   // event_type: "Violence against civilians"
    //   fatalities: +fatalities,
    //   geo_precision: +geo_precision,
    //   iso: +iso,
    //   iso3: iso3,
    //   latitude: +latitude,
    //   location: location,
    //   longitude: +longitude,
    //   notes: notes,
    //   region: region,
    //   source: source,
    //   source_scale: source_scale,
    //   sub_event_type: sub_event_type,
    //   time_precision: +time_precision,
    //   timestamp: +timestamp,
    //   year: year
    // }


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
event_type: "Violence against civilians"
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



    // src
    // http://bl.ocks.org/phoebebright/raw/3176159/