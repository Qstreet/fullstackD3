// script.js
// var d3 = require("d3");

var margin = { top: 20, right: 10, bottom: 20, left: 10 };

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#graphic").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [25, 20, 10, 12, 15]

var data2 = [
    { grade: "A", value: 7 },
    { grade: "B", value: 5 },
    { grade: "C", value: 2 }
]

var circles = svg.selectAll('circle')
    .data(data);

circles.enter()
    .append('circle')
    .attr('cx', function (d, i) {
        return (i * 50) + 25
    })
    .attr('cy', function (d, i) {
        return (i * d)
    })
    .attr('r', function (d) {
        return d;
    })
    .attr('fill', 'red')

//let val_extent = d3.extent(data2, function (d) {
//    return d.value
//})

var grade_map = data2.map(function (d) {
    return d.value * 5
})

console.log(grade_map)