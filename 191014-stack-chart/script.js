https://observablehq.com/@d3/stacked-bar-chart?collection=@d3/d3-

https://stackoverflow.com/questions/45941427/d3-stacked-chart-with-json-data#45944893

https://stackoverflow.com/questions/51565900/using-json-in-d3v4-stacked-bar-chart?rq=1

https://stackoverflow.com/questions/32298844/d3-js-stacked-bar-chart-from-vertical-to-horizontal?rq=1



chart = {
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", (d, i) => x(d.data.name))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth());

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  return svg.node();
  }

series = d3.stack().keys(data.columns.slice(1))(data)