async function drawLineChart() {
  // console.log("Hey Chart");

  const dataset = await d3.json("./fullstackD3/my_weather_data.json")
  // console.log(dataset);

  // ACCESSOR fn  convert single data pt into a value
  const yAccessor = d => d.temperatureMax

  // TIME PARSE and X ACCESSOR
  const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)

  // WRAPPER AND BOUNDS
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  const wrapper = d3.select("#wrapper")
  const svg = wrapper.append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append('g')
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)` )
      
  const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0])

console.log(yScale(32));

}

drawLineChart()