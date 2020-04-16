//https://www.d3-graph-gallery.com/graph/heatmap_basic.html

    // set the dimensions and margins of the graph
    var figureSize = 350;
    var margin = {
            top: 65,
            right: 65,
            bottom: 65,
            left: 65
        },
        width = figureSize - margin.left - margin.right,
        height = figureSize - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    var axisLabelsX = ["gene_A", "gene_B", "gene_C", "gene_D", "gene_E", "gene_F", "gene_G", "gene_H", "gene_I", "gene_J"]
    var axisLablesY = ["cell_type_10", "cell_type_9", "cell_type_8", "cell_type_7", "cell_type_6", "cell_type_5", "cell_type_4", "cell_type_3", "cell_type_2", "cell_type_1"]

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(axisLabelsX)
        .padding(0.05);

    svg.append("g")
        // Call X axis
        .call(d3.axisTop(x))
        //Remove tickmarks from X axis
        .attr('stroke-width', 0)
        // Rotate X-axis labels
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(-45)")
        .attr("dy", "0")
        .attr("dx", ".5em");

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(axisLablesY)
        .padding(0.05);

    // Remove tickmarks from Y axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr('stroke-width', 0);

    // Build color scale from "white" to "intellia orange"
    var myColor = d3.scaleLinear()
        .range(["white", "#d34927"])
        // Domain fixed, change to max/min of min/max of values?
        .domain([1, 1000])


    // get CSV data
    d3.csv("data/heatmap_data.csv").then(function(data) {

        //Read the data
        svg.selectAll()
            .data(data, function(d) {
                return d.genes + ':' + d.cells;
            })

            // Make Recangles for each row in CSV
            .enter()
            .append("rect")

            // Place Rectangles according to data
            .attr("x", function(d) {
                return x(d.genes)
            })
            .attr("y", function(d) {
                return y(d.cells)
            })

            // Size Rectangles
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())

            // Fill heatmap colors by data=value
            .style("fill", function(d) {
                return myColor(d.value)
            })
            // Heatmap Circles
            .attr("rx", 20)
            .attr("ry", 20)

            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.cells + "<br/>" + d.genes + "<br/>" + "value: " + d.value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    });