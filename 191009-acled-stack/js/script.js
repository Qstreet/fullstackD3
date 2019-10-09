async function drawDataViz() {

  // ACCESSOR FUNCTIONS

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

  const csvURL = "../data/2019-10-09.csv"

  const csvData = await d3.csv(csvURL)

  console.log(csvData);


}

drawDataViz()
    