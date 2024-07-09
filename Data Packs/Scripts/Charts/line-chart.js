function GroupedBarChart({ jsonData }) {
  // Effect hook to draw bar chart using D3.js
  React.useEffect(() => {
    if (jsonData) {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 425;
      const height = 375;

      const svg = d3
        .select("#groupedBarGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract x-axis values dynamically
      const xPropertyName = Object.keys(jsonData[0])[0]; // Assuming the first property name is the x-axis property
      const xValues = jsonData.map((d) => d[xPropertyName]);
      console.log("X-axis values:", xValues);

      // Define the y-axis keys (percentage values)
      const yKeys = ["Lambeth (%)", "England (%)", "London (%)"];

      // Extract data for each x-axis value
      const data = xValues.map((d) => ({
        x: d,
        values: yKeys.map((y) => ({
          region: y.split(" ")[0], // Extract region name (Lambeth, London, England)
          percentage: +jsonData.find((entry) => entry[xPropertyName] === d)[y],
        })),
      }));

      const x = d3.scaleBand().domain(xValues).range([0, width]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d3.max(d.values, (v) => v.percentage))])
        .nice()
        .range([height, 0]);

      const color = d3
        .scaleOrdinal()
        .domain(yKeys.map((y) => y.split(" ")[0]))
        .range(d3.schemeCategory10);

      svg
        .selectAll(".bar-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", (d) => `translate(${x(d.x)},0)`)
        .selectAll(".bar")
        .data((d) => d.values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => (x.bandwidth() / 3) * i)
        .attr("width", x.bandwidth() / 3)
        .attr("y", (d) => y(d.percentage))
        .attr("height", (d) => height - y(d.percentage))
        .attr("fill", (d) => color(d.region));

      // Add x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add y-axis
      svg.append("g").call(d3.axisLeft(y));
    }
  }, [jsonData]);

  return <div id="groupedBarGraph">{/* Bar graph will be drawn here */}</div>;
}
function LineChart({ jsonData, xLabel, yLabel }) {
  React.useEffect(() => {
    if (jsonData) {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 425;
      const height = 325;

      // Append SVG container to the #lineGraph div
      const svgContainer = d3
        .select("#lineGraph")
        .append("div")
        .style("position", "relative");

      // Append SVG to svgContainer
      const svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Log to check if the labels are correctly set
      console.log("Setting X Label:", xLabel);
      console.log("Setting Y Label:", yLabel);

      // Extract unique time periods
      const uniqueTimePeriods = Array.from(
        new Set(jsonData.map((d) => d["Time period"]))
      );

      const x = d3
        .scaleBand()
        .domain(uniqueTimePeriods)
        .range([0, width])
        .padding(0.1);

      // Find the minimum and maximum values of the data
      const minValue = d3.min(jsonData, (d) => +d.Value);
      const maxValue = d3.max(jsonData, (d) => +d.Value);

      // Calculate a suitable y-axis range based on the data range
      const yDomainMin = minValue - 0.1 * (maxValue - minValue); // Add a margin of 10% below the minimum value
      const yDomainMax = maxValue + 0.1 * (maxValue - minValue); // Add a margin of 10% above the maximum value

      const y = d3
        .scaleLinear()
        .domain([yDomainMin, yDomainMax])
        .nice()
        .range([height, 0]);

      const areaNames = Array.from(new Set(jsonData.map((d) => d["AreaName"]))); // Get unique area names

      // Define color scale for lines
      const color = d3
        .scaleOrdinal()
        .domain(areaNames)
        .range(d3.schemeCategory10);

      // Draw lines for each area name and add circles for data points
      areaNames.forEach((areaName, i) => {
        const areaData = jsonData.filter((d) => d["AreaName"] === areaName);
        const line = d3
          .line()
          .x((d) => x(d["Time period"]) + x.bandwidth() / 2)
          .y((d) => y(+d.Value));

        svg
          .append("path")
          .datum(areaData)
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", color(areaName))
          .attr("stroke-width", 3) // Initial thickness
          .attr("d", line)
          .on("mouseenter", function () {
            d3.select(this).style("cursor", "crosshair");
            d3.select(this).attr("stroke-width", 5); // Make the line thicker on hover
          })
          .on("mouseleave", function () {
            d3.select(this).style("cursor", "default");
            d3.select(this).attr("stroke-width", 3); // Restore the initial thickness on mouseout
          });

        // Add circles for data points
        svg
          .selectAll(".circle-" + areaName) // Ensure unique class name for circles in each area
          .data(areaData)
          .enter()
          .append("circle")
          .attr("class", "circle circle-" + areaName) // Unique class name
          .attr("cx", (d) => x(d["Time period"]) + x.bandwidth() / 2)
          .attr("cy", (d) => y(+d.Value))
          .attr("r", 6) // Adjust the radius of the circle (bigger than before)
          .attr("fill", color(areaName))
          .on("mouseenter", function () {
            d3.select(this)
              .style("cursor", "pointer")
              .attr("stroke", "black") // Add black border on hover
              .attr("stroke-width", 2); // Adjust border width
          })
          .on("mouseleave", function () {
            d3.select(this).style("cursor", "default").attr("stroke", "none"); // Remove border on mouseout
          })
          .on("mouseover", function (event, d) {
            const circle = d3.select(this);
            const circleX = parseFloat(circle.attr("cx"));
            const circleY = parseFloat(circle.attr("cy"));
            const tooltipWidth = parseFloat(tooltip.style("width"));
            const tooltipHeight = parseFloat(tooltip.style("height"));

            // Calculate the left and top positions for the tooltip
            const left = circleX - tooltipWidth / 2;
            const top = circleY - tooltipHeight - 10;

            // Ensure the tooltip stays within the bounds of the SVG
            const svgWidth = parseFloat(svg.attr("width"));
            const svgHeight = parseFloat(svg.attr("height"));

            // Adjust left position to stay within SVG bounds
            const maxLeft = svgWidth - tooltipWidth;
            const adjustedLeft = Math.min(maxLeft, Math.max(0, left));

            // Adjust top position to stay within SVG bounds
            const maxTop = svgHeight - tooltipHeight;
            const adjustedTop = Math.min(maxTop, Math.max(0, top));

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(`Area: ${d.AreaName}<br/>Value: ${d.Value}`)
              .style("left", adjustedLeft + "px")
              .style("top", adjustedTop + "px");
          })
          .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      });

      // Add legend
      const legend = svg
        .selectAll(".legend")
        .data(areaNames)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend
        .append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend
        .append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text((d) => d);

      // Add x-axis label
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20) // Adjust this value for positioning
        .style("text-anchor", "middle")
        .attr("font-family", "Arial") // Adjust font family
        .attr("font-size", "14px") // Adjust font size
        .text(xLabel);

      // Add x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("font-family", "Arial") // Adjust font family
        .attr("font-size", "12px") // Adjust font size
        .attr("transform", "rotate(-45)") // Rotate x-axis labels if needed
        .style("text-anchor", "end");

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

      // Add y-axis
      svg
        .append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("font-family", "Verdana") // Adjust font family
        .attr("font-size", "12px")
        .attr("color", "#212c61"); // Adjust font size

      // Edit x-axis line
      svg.select(".domain"); // Select the line element representing the x-axis

      // Edit y-axis line
      svg.select(".domain"); // Select the line element representing the y-axis

      // Append tooltip to svgContainer
      const tooltip = svgContainer
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    }
  }, [jsonData, xLabel, yLabel]);

  return <div id="lineGraph">{/* Line graph will be drawn here */}</div>;
}
function CrimeChart({ jsonData }) {
  const [showMap, setShowMap] = React.useState(false);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  React.useEffect(() => {
    if (jsonData) {
      if (showMap) {
        const mapContainer = d3.select("#mapContainer");
        // Clear previous map
        mapContainer.selectAll("*").remove();

        // Set up SVG element with custom width and height
        const svg = mapContainer
          .append("svg")
          .attr("width", 600) // Custom width
          .attr("height", 400); // Custom height

        // Load GeoJSON data
        d3.json("/Scripts/Ward Map/lambeth-ward-map.geojson").then(function (
          geojson
        ) {
          // Iterate over each feature
          geojson.features.forEach((feature) => {
            // Access the properties object to get the ward name
            const wardName = feature.properties.WARD_NAME;
            console.log(wardName); // Log the ward name

            // Define projection and path generator
            const projection = d3.geoMercator().fitSize([250, 350], geojson); // Adjust width and height as needed
            const path = d3.geoPath().projection(projection);

            // Append paths for each feature
            svg
              .selectAll("path")
              .data(geojson.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("class", "ward")
              .append("title")
              .text((d) => d.properties.WARD_NAME);
          });
        });
      } else {
        // Logic to display line chart
        // Clear previous line chart
        d3.select("#lineChart").selectAll("*").remove();

        // Sort the data by time period
        jsonData.sort(
          (a, b) => new Date(a["Time period"]) - new Date(b["Time period"])
        );

        // Filter data for Lambeth and London
        const filteredData = jsonData.filter((d) =>
          ["Lambeth", "London"].includes(d.AreaName)
        );

        // Group filtered data by AreaName
        const groupedData = d3.group(filteredData, (d) => d.AreaName);

        // Prepare your HTML structure to hold the chart
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
        const width = 425;
        const height = 325;

        // Append SVG container to the #lineChart div
        const svgContainer = d3
          .select("#lineChart")
          .append("div")
          .style("position", "relative");

        // Append SVG to svgContainer
        const svg = svgContainer
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales and axes for your chart
        const xScale = d3
          .scalePoint()
          .domain(jsonData.map((d) => d["Time period"]))
          .range([0, width]);
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(jsonData, (d) => d["Offences per 1,000 people"])])
          .nice()
          .range([height, 0]);
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Draw the lines representing the data
        const line = d3
          .line()
          .x((d) => xScale(d["Time period"]))
          .y((d) => yScale(d["Offences per 1,000 people"]));

        // Draw lines for each AreaName and add legend
        const legend = svg.append("g").attr("class", "legend");

        let i = 0;
        groupedData.forEach((data, areaName) => {
          svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", areaName === "Lambeth" ? "steelblue" : "green")
            .attr("stroke-width", 2)
            .attr("d", line);

          legend
            .append("text")
            .attr("x", width - 100)
            .attr("y", 15 + i * 20)
            .attr("dy", "0.32em")
            .style("font-size", "12px")
            .attr("fill", areaName === "Lambeth" ? "steelblue" : "green")
            .text(areaName);

          i++;
        });

        // Add axes
        svg
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(xAxis)
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");
        svg.append("g").call(yAxis);

        // Add labels, titles, and other necessary elements
        svg
          .append("text")
          .attr(
            "transform",
            `translate(${width / 2}, ${height + margin.top + 20})`
          )
          .style("text-anchor", "middle");
        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Offences per 1000 People");
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "15px");

        // Show the chart when not displaying map
        svgContainer.style("display", "block");
      }
    }
  }, [jsonData, showMap]);

  return (
    <div>
      <button onClick={toggleMap}>{showMap ? "Main Chart" : "Map Data"}</button>
      <div id="lineChart" style={{ display: showMap ? "none" : "block" }}></div>
      <div
        id="mapContainer"
        style={{ display: showMap ? "block" : "none" }}
      ></div>
    </div>
  );
}
function SurveyChart({ jsonData }) {
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedQuestion, setSelectedQuestion] = React.useState("");
  const svgRef = React.useRef();

  React.useEffect(() => {
    if (jsonData) {
      const initialLocation = "Brixton Acre Lane";
      setSelectedLocation(initialLocation);
      setSelectedQuestion(
        jsonData &&
          Array.from(new Set(jsonData.map((entry) => entry.Question)))[0]
      );
      drawBarChart(selectedQuestion, initialLocation);

      console.log(
        "Area Names:",
        Object.keys(jsonData[0]).filter(
          (key) =>
            key !== "Response" &&
            key !== "Percentage of respondents" &&
            key !== "Question"
        )
      );

      console.log(
        "Questions:",
        Array.from(new Set(jsonData.map((entry) => entry.Question)))
      );
    }
  }, [jsonData]);

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);
    drawBarChart(selectedQuestion, newLocation);
  };

  const handleQuestionChange = (event) => {
    const newQuestion = event.target.value;
    setSelectedQuestion(newQuestion);
    drawBarChart(newQuestion, selectedLocation);
  };

  const drawBarChart = (question, location) => {
    if (!jsonData || jsonData.length === 0 || !location || !question) {
      console.log("No data available or location/question not selected");
      return;
    }

    const selectedData = jsonData.filter(
      (entry) => entry.Question === question
    );

    const selectedLocationData = selectedData.map((entry) => ({
      response: entry.Response,
      value: entry[location],
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 425 - margin.left - margin.right;
    const height = 325 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(selectedLocationData.map((entry) => entry.response))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(selectedLocationData, (d) => d.value)])
      .nice()
      .range([height, 0]);

    const svgElement = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgElement
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svgElement.append("g").call(d3.axisLeft(y).ticks(10));

    svgElement
      .selectAll(".bar")
      .data(selectedLocationData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.response))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .style("fill", "steelblue");
  };

  return (
    <div>
      <div>
        <select value={selectedLocation} onChange={handleLocationChange}>
          {jsonData &&
            Object.keys(jsonData[0])
              .filter(
                (key) =>
                  key !== "Response" &&
                  key !== "Percentage of respondents" &&
                  key !== "Question"
              )
              .map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
        </select>
      </div>
      <div>
        <select value={selectedQuestion} onChange={handleQuestionChange}>
          {jsonData &&
            Array.from(new Set(jsonData.map((entry) => entry.Question))).map(
              (question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              )
            )}
        </select>
      </div>
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
