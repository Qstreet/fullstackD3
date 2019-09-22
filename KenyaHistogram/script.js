async function drawDataViz() {

  const dateParser = d3.timeParse('%Y-%m-%d')

  const jsonData = "https://api.acleddata.com/acled/read?terms=accept&iso=404&event_type=Protests&event_type=Riots"

  const accessor01 = d => d.admin1

  const dataJson = await d3.json(jsonData)
  const dataset = dataJson.data 

  // make array of all admin1 locations in this JSON call
  const ordinalDomainArray = []
  dataset.forEach(function (data) {
    if (!ordinalDomainArray.includes(data.admin1)) {
      return ordinalDomainArray.push(data.admin1)
    }
  })

console.log(dataset[0]);

dataset.forEach(item, idx, array) {
  let admin1Map = {}
  let key = dataset[idx].admin1
  
  if (admin1Map.hasOwnProperty(key)) {
    admin1Map[key] = admin1Map[key] + 1;
  } else {
    admin1Map[key] = 1;
  }
}
console.log(admin1Map);
  // function createAdmin1Map(dataset) {
  //   let admin1Map = {};

  //   dataset.forEach(function (key) {
  //     if (admin1Map.hasOwnProperty(key)) {
  //       admin1Map[key] = admin1Map[key] + 1;
  //     } else {
  //       admin1Map[key] = 1;
  //     }
  //   })
  //   return admin1Map;
  // }

  // let x = createAdmin1Map(dataset)
  // console.log(x);

  // for histrogram which should be 2x as wide as tall
  let dimensions = {
    width: window.innerWidth * 0.8,
    height: window.innerWidth * 0.4,
    margin: {
      top: 15,
      right: 15,
      bottom: 50,
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

  // const xScale = d3.scaleOrdinal()
  //   .domain(d3.max(dataset, accessor01))
  //   .range([0, dimensions.boundedWidth])

  // console.log(xScale('Nairobi'));

  // const binsGenerator = d3.histogram()
  //   .domain(xScale(accessor01))

  // const bins = binsGenerator(dataset)
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