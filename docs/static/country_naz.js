//country_view.js
document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners();
});

function setupEventListeners() {
    const countryInput = document.getElementById("country-input");
    countryInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default action to avoid submitting a form if applicable
            updateCountryData(countryInput.value.trim());
            document.querySelector('.container').style.display = 'block'; // Adjust to make sure it fits well in the panel
        }
    });
}


function updateCountryData(country) {
    // Clear the existing content
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => container.innerHTML = '');

    createBibGourmandTable(country);
    facilities(country);
    SecondHorizontalChart(country);
    createPriceDistributionPlots(country);
    adjustContainerSizes();
}

function adjustContainerSizes() {
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => {
        const chart = container.querySelector('.chart');
        if (chart) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('chart-wrapper');
            wrapper.style.padding = '40px'; // Adjust padding as needed
            wrapper.appendChild(chart.cloneNode(true));
            container.innerHTML = ''; // Clear the container
            container.appendChild(wrapper);
        }
    });
}

// Additional styles in your CSS:
// .content-wrapper {
//     width: 100%; // Ensures the wrapper fills the container
//     border: 1px solid #ccc; // Optional, for visibility
// }

function createBibGourmandTable(country){
    d3.json("../data/countryAwardsDict.json").then(function(data) {
        const countryData = data[country] || {};

        // Extract data array from the dictionary
        const ratingsData = [
            { rating: "Total Restaurants", restaurants: countryData['Total_restaurants'] || 0 },
            { rating: "Bib Gourmand", restaurants: countryData['Bib Gourmand'] || 0 },
            { rating: "1 Star", restaurants: countryData['1 Star'] || 0 },
            { rating: "2 Stars", restaurants: countryData['2 Stars'] || 0 },
            { rating: "3 Stars", restaurants: countryData['3 Stars'] || 0 }
        ];

        const table = d3.select("#bib-gourmand").append("table").attr("class", "styled-table");
        const thead = table.append("thead");
        const tbody = table.append("tbody");

        // Append table headers
        thead.append("tr")
            .selectAll("th")
            .data(["Rating", "Number of Restaurants"])
            .enter()
            .append("th")
            .text(function(d) { return d; });

        // Append table rows
        const rows = tbody.selectAll("tr")
            .data(ratingsData)
            .enter()
            .append("tr");

        // Append data to each row
        rows.selectAll("td")
            .data(function(d) { return [d.rating, d.restaurants]; })
            .enter()
            .append("td")
            .html(function(d, i) {
                if (i === 0) {
                    if (d === "Bib Gourmand") {
                        return "<img src='../static/images/bib_gourmand.jpg' alt='Bib Gourmand' class='tiny-image' /> " + d;
                    } else if (typeof d === "string" && d.includes("Star")) {
                        const stars = d.split(" ")[0];
                        return "<span>" + "<img src='../static/images/1star.svg.png' alt='Star' class='tiny-image' /> ".repeat(parseInt(stars)) + "</span>" + d;
                    } else {
                        return d; // Fallback in case the data is not as expected
                    }
                } else {
                    return d;
                }
            });

        adjustContainerSizes(); // Ensure container sizes are adjusted after table creation
    }).catch(function(error) {
        console.error('Error loading the awards data:', error);
    });
}

function setupHorizontalChartAxes(svg, data, width, height) {
    const x = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, height])
        .padding(0.1);

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).tickSize(0)); // Remove tick lines

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(d3.format("d"))); // Adjust tickSize to -height

}

function addHorizontalChartBars(svg, data, width, height) {
    const x = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, height])
        .padding(0.1);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = setupTooltip();

    svg.selectAll(".bar")
        .data(Object.entries(data))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d[0]))
        .attr("width", d => x(d[1]))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => color(i))
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${d[0]}: ${d[1]}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });
}

function facilities(country) {
    const margin = { top: 30, right: 100, bottom: 70, left: 60 },
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Select the container for the chart and set up the SVG element
    const svg = d3.select("#facility-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load the facilities data from the JSON file
    d3.json("../data/facilities.json").then(function(allFacilities) {
        // Get data for the specific country or default to an empty object if not found
        const facData = allFacilities[country] || {};

        // Set up the axes using the loaded data
        setupHorizontalChartAxes(svg, facData, width, height);
        addHorizontalChartBars(svg, facData, width, height);
        adjustContainerSizes();  // Ensure container sizes are adjusted after chart creation
        svg.selectAll(".axis--y text")
            .style("font-size", "5px"); // Adjust the font size as needed
    }).catch(function(error) {
        console.error('Error loading the facilities data for ' + country + ':', error);
    });
}


function setupVerticalChartAxes(svg, data, width, height) {
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Continent))
        .padding(0.2);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([0, 4500])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));
}

function addVerticalChartBars(svg, data, width, height) {
    const y = d3.scaleLinear().domain([0, 4500]).range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const tooltip = setupTooltip();

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => d3.scaleBand().range([0, width]).domain(data.map(d => d.Continent))(d.Continent))
        .attr("width", d3.scaleBand().range([0, width]).domain(data.map(d => d.Continent)).padding(0.2).bandwidth())
        .attr("fill", d => colorScale(d.Continent))
        .attr("y", d => y(0))
        .attr("height", 0)
        .on("mouseover", (event, d) => showTooltip(event, tooltip, `Continent: ${d.Continent}<br/>Listings: ${d.Listings}`))
        .on("mouseout", () => hideTooltip(tooltip))
        .transition()
        .duration(800)
        .attr("y", d => y(d.Listings))
        .attr("height", d => height - y(d.Listings));
}

function setupTooltip() {
    return d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "red")    // Sets the background color of the tooltip to red
        .style("color", "white")            // Sets the text color to white
        .style("padding", "10px")           // Adds some padding inside the tooltip for better readability
        .style("border-radius", "5px")      // Optionally adds rounded corners
        .style("pointer-events", "none");   // Ensures the tooltip itself does not interfere with mouse events
}

function showTooltip(event, tooltip, htmlContent) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(htmlContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function hideTooltip(tooltip) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}


function SecondHorizontalChart(country) {
    d3.json("../data/cuisines.json").then(function(data) {
        const countryData = data[country] || {};
        let entries = Object.entries(countryData);

        // Sorting entries by value in descending order and slicing top 10 if more than 10 exist
        entries = entries.sort((a, b) => b[1] - a[1]);
        if (entries.length > 10) {
            entries = entries.slice(0, 10);  // Only keep the top 10
        }

        const margin = { top: 30, right: 100, bottom: 70, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Clear previous contents
        const svgContainer = d3.select("#second-horizontal-chart");
        svgContainer.selectAll("*").remove();

        const svg = svgContainer
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Reconstructing countryData for adjusted entries
        let adjustedCountryData = {};
        entries.forEach(([key, value]) => {
            adjustedCountryData[key] = value;
        });

        setupHorizontalChartAxes(svg, adjustedCountryData, width, height);
        addHorizontalChartBars(svg, adjustedCountryData, width, height);
        adjustContainerSizes();
        svg.selectAll(".axis--y text")
            .style("font-size", "7px");  // Adjust the font size as needed
    }).catch(function(error) {
        console.error("Error loading cuisine data: ", error);
    });
}



function createPriceDistributionPlots(country) {
    let activeAwards = new Set();

    const margin = { top: 30, right: 100, bottom: 70, left: 60 },
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#price-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().padding(0.1).range([0, height]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const tooltip = setupTooltip();

    // Load data from JSON file
    d3.json("../data/prices.json").then(function(data) {
        // Filter data for the selected country
        let countryData = data.filter(d => d.country === country);

        if (!countryData.length) {
            console.error('No data found for the specified country:', country);
            return; // Exit if no data is found
        }

        // Update chart function using loaded data
        function updateChart() {
            let filteredData = countryData.filter(d => {
                if (activeAwards.size === 0) return true;
                let awardMatch = false;
                activeAwards.forEach(award => {
                    if (d[award] > 0) awardMatch = true;
                });
                return awardMatch;
            });

            let totalPrices = filteredData.map(d => {
                let totalPrice = 0;
                if (activeAwards.size === 0) {
                    Object.keys(d).forEach(key => {
                        if (key !== "Price") totalPrice += d[key];
                    });
                } else {
                    activeAwards.forEach(award => {
                        totalPrice += d[award];
                    });
                }
                return { Price: d.Price, TotalPrice: totalPrice };
            });

            totalPrices = totalPrices.sort((a, b) => b.TotalPrice - a.TotalPrice).slice(0, 10);
            x.domain([0, d3.max(totalPrices, d => d.TotalPrice)]);
            y.domain(totalPrices.map(d => d.Price));

            svg.selectAll(".bar").remove();
            svg.selectAll(".axis").remove();

            svg.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y));
            svg.selectAll(".axis--y text").style("font-size", "12px");
            svg.append("g").attr("class", "axis axis--x").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5).tickSize(-height));
            svg.selectAll(".bar")
                .data(totalPrices)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("y", d => y(d.Price))
                .attr("height", y.bandwidth())
                .attr("x", 0)
                .attr("width", d => x(d.TotalPrice))
                .attr("fill", (d, i) => color(i))
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(d.Price + ": " + d.TotalPrice)
                           .style("left", (event.pageX + 5) + "px")
                           .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            adjustContainerSizes();
        }

        updateChart(); // Call to update the chart
    }).catch(error => {
        console.error('Error fetching price data:', error);
    });
}


