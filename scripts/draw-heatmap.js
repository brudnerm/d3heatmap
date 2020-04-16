//https://www.d3-graph-gallery.com/graph/heatmap_basic.html

////// SETUP SVG
    // Set the dimensions and margins of the graph
var figureSize = 800;
var margin = {
        top: 65,
        right: 65,
        bottom: 65,
        left: 65
    },
    width = figureSize - margin.left - margin.right,
    height = figureSize * .5 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

////// DEFINE FUNCTION FOR DRAWING HEATMAP
function drawHeatmap(data) {
    console.log(data[0])

    // SET UP DIV FOR TOOLTIP
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Set whitespace between heatmap squares
    var whitespace = 0.075;

////// SET UP X AXIS
    // Get all unique values for X axis
    let axisLabelsX = [...new Set(data.map(item => item.genes))];
    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(axisLabelsX)
        // X padding
        .padding(whitespace);

    // Refer to X axis
    svg.append("g").call(d3.axisTop(x))
    // Remove tickmarks from X axis
        .attr('stroke-width', 0)
        // Set up X axis labels
        .selectAll("text")
            // Rotate X-axis labels
            .style("text-anchor", "start")
            .attr("transform", "rotate(-45)")
            .attr("dy", "0")
            .attr("dx", ".5em")
            // X axis font size
            .attr("font-size", "8px");
    
////// SET UP Y AXIS
    // Get all unique values for Y axis
    let axisLabelsY = [...new Set(data.map(item => item.cells))]
        // sort Y axis alphabetically
        .sort(d3.descending);
    
    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(axisLabelsY)
        // Y padding
        .padding(whitespace);

    // Refer to Y axis
    svg.append("g").call(d3.axisLeft(y))
            // Remove tickmarks from Y axis
            .attr('stroke-width', 0);

////// SET UP COLOR SCALE FOR HEATMAP            
    var myColor = d3.scaleLinear()
        // Define color scale from "white" to "intellia orange"
        .range(["white", "#d34927"])
        // Domain fixed, change to max/min of min/max of values?
        .domain([1, 1000])

////// SET UP THE HEATMAP
    //Read the data and cross link the variables
    svg.selectAll()
    .data(data, function(d) {
        return d.genes + ':' + d.cells;
    })

    // Make heatmap squares for each row in CSV
    .enter()
    .append("rect")

    // Place heatmap squares according to data
    .attr("x", function(d) {
        return x(d.genes)
    })
    .attr("y", function(d) {
        return y(d.cells)
    })

    // Size heatmap squares
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())

    // Fill heatmap colors by value
    .style("fill", function(d) {
        return myColor(d.value)
    })

    // Start tooltip on mouesover
    .on("mouseover", function(d) {
        // Set opacity and transition
        div.transition()
            .duration(200)
            .style("opacity", .9);
        // Define tooltip labels and data
        div.html(d.cells + "<br/>" + d.genes + "<br/>" + "value: " + d.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
    })

    // Kill tooltip on mouseout
    .on("mouseout", function(d) {
        // Set opacity and transitio
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });

};

////// GET THE CSV DATA
d3.csv("data/heatmap_data.csv").then(function(data) {
    
    // Draw heatmap from data
    drawHeatmap(data)

});