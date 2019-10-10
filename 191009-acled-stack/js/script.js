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

/*   OLD  */

  // circles = d3.select('#wrapper')
  //   .selectAll('circle')
  //   .data([1, 2, 3, 4])
  // circles.enter().append('circle')
  // circles.exit().remove()
  // circles.merge().attr('r', (d) => d)

/*   NEW  */
  // circles = d3.select('#wrapper')
  //   .selectAll('circle')
  //   .data([1, 2, 3, 4])

  // circles.join('circle')
  //   .attr('r', (d) => d)

/*   JOIN CYCLE  */

const circles = d3.select('#wrapper')
    .selectAll('circle')
    .data([1, 2, 3, 4])

  circles.join(
    enter =>
      enter.append('circle').attr('fill', 'green'),
    exit => exit.attr('fill', 'brown').call(
      exit =>
        exit
          .transition(wrapper.transition().duration(750))
          .remove()
    )
  )

  /* TOOLTIP  */

  d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr('style', 'position: absolute; opacity: 0;');

  d3.select('body')
    .append('#wrapper')
    .attr('width', 300)
    .attr('height', 300);

  d3.select('#wrapper')
    .selectAll('circle')
    .data(['a', 'b', 'c'])
    .join('circle')
    .attr('r', 3)
    .attr('cy', 5)
    .attr('cx', (d, i) => i * 15 + 15)
    .on('mouseover', function (d) {
      d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d)
    })
    .on('mouseout', function () {
      d3.select('#tooltip').style('opacity', 0)
    })
    .on('mousemove', function () {
      d3.select('#tooltip').style('left', (d3.event.pageX + 10) + 'px').style('top', (d3.event.pageY + 10) + 'px')
    })




}

drawDataViz()