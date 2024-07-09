const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Remove previous SVG
d3.select("#lineGraph svg").remove();

// Create SVG container
const svg = d3
  .select("#lineGraph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${
      height + margin.top + margin.bottom
    }`
  )
  .classed("svg-content", true)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
// Parse the data
jsonData.forEach((d) => {
  d[xKey] = d[xKey];
  d[yKey] = +d[yKey];
});

// Filter data for only main locations
const filteredData = jsonData.filter((d) =>
  mainLocations.includes(d[thirdKey])
);

// Group data by thirdKey (location)
const groupedData = d3.group(filteredData, (d) => d[thirdKey]);

// Scale functions
const x = d3
  .scaleBand()
  .domain(jsonData.map((d) => d[xKey]))
  .range([0, width])
  .padding(0.1);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(filteredData, (d) => d[yKey])])
  .nice()
  .range([height, 0]);

// Add the x-axis
svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("transform", "rotate(-45)");

// Add the y-axis
svg.append("g").call(d3.axisLeft(y));

// Add y-axis label
svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .attr("font-family", "Arial") // Adjust font family
  .attr("font-size", "14px") // Adjust font size
  .text(yLabel);

// Add lines for each group
const line = d3
  .line()
  .x((d) => x(d[xKey]) + x.bandwidth() / 2)
  .y((d) => y(d[yKey]));

groupedData.forEach((groupData, location) => {
  svg
    .append("path")
    .datum(groupData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
});
