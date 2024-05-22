 // Initialize Leaflet map



 // Define constants for configuration
 const MAP_CENTER = [46.519653, 6.632273];
 const MAP_ZOOM_LEVEL = 4;
 const DATA_URL = "/project-2024-datatouille/data/michelin_restaurants.geojson";
 
 let currentFilters = {}; // Store current filters globally
 let allFeaturesData = []; // Cache all features data
 
 
 
 const countryDetails = {
     'France': { coords: [48.8566, 2.3522], zoom: 6 },
     'Japan': { coords: [35.6895, 139.6917], zoom: 7 },
     'Italy': { coords: [41.9028, 12.4964], zoom: 7 },
     'USA': { coords: [39.833333, -98.585522], zoom: 5 },
     'Germany': { coords: [52.5200, 13.4050], zoom: 7 },
     'Spain': { coords: [40.4168, -3.7038], zoom: 6 },
     'United Kingdom': { coords: [51.5074, -0.1278], zoom: 7 },
     'Belgium': { coords: [50.8503, 4.3517], zoom: 9 },
     'Switzerland': { coords: [46.9470, 7.4474], zoom: 8 },
     'China Mainland': { coords: [39.9042, 116.4074], zoom: 5 },
     'Thailand': { coords: [13.7563, 100.5018], zoom: 7 },
     'Netherlands': { coords: [52.3676, 4.9041], zoom: 8 },
     'Taiwan': { coords: [25.0330, 121.5654], zoom: 8 },
     'Hong Kong SAR China': { coords: [22.3193, 114.1694], zoom: 10 },
     'Singapore': { coords: [1.3521, 103.8198], zoom: 10 },
     'South Korea': { coords: [37.5665, 126.9780], zoom: 8 },
     'Portugal': { coords: [38.7223, -9.1393], zoom: 7 },
     'Canada': { coords: [45.4215, -75.6972], zoom: 4 },
     'Malaysia': { coords: [3.1390, 101.6869], zoom: 7 },
     'Brazil': { coords: [-15.8267, -47.9218], zoom: 5 },
     'Denmark': { coords: [55.6761, 12.5683], zoom: 8 },
     'United Arab Emirates': { coords: [24.4539, 54.3773], zoom: 8 },
     'Turkey': { coords: [39.9334, 32.8597], zoom: 6 },
     'Vietnam': { coords: [21.0285, 105.8542], zoom: 7 },
     'Ireland': { coords: [53.3498, -6.2603], zoom: 8 },
     'Sweden': { coords: [59.3293, 18.0686], zoom: 6 },
     'Austria': { coords: [48.2082, 16.3738], zoom: 8 },
     'Croatia': { coords: [45.8150, 15.9819], zoom: 8 },
     'Macau SAR China': { coords: [22.1987, 113.5439], zoom: 11 },
     'Norway': { coords: [59.9139, 10.7522], zoom: 6 },
     'Greece': { coords: [37.9838, 23.7275], zoom: 7 },
     'Slovenia': { coords: [46.0569, 14.5058], zoom: 8 },
     'Luxembourg': { coords: [49.6116, 6.1319], zoom: 10 },
     'Hungary': { coords: [47.4979, 19.0402], zoom: 8 },
     'Argentina': { coords: [-34.6037, -58.3816], zoom: 6 },
     'Poland': { coords: [52.2297, 21.0122], zoom: 7 },
     'Malta': { coords: [35.8989, 14.5146], zoom: 10 },
     'Finland': { coords: [60.1699, 24.9384], zoom: 6 },
     'Estonia': { coords: [59.4370, 24.7536], zoom: 8 },
     'Latvia': { coords: [56.9496, 24.1052], zoom: 8 },
     'Iceland': { coords: [64.1466, -21.9426], zoom: 6 },
     'Czech Republic': { coords: [50.0755, 14.4378], zoom: 8 },
     'Serbia': { coords: [44.7866, 20.4489], zoom: 8 },
     'Andorra': { coords: [42.5063, 1.5218], zoom: 10 }
 };
 
 let currentEntity = "all"
 let currentTheme = 'default'; // Track the currently selected theme
 
 // Initialize and configure the map
 let map; // Declare a variable to hold the map instance.
 let currentTileLayer; // Declare a variable to hold the current tile layer, allowing easy changes later.
 
 function initializeMap() {
     // Initialize the Leaflet map on the 'map' div, set the view to the predefined center and zoom level
     map = L.map('map', { zoomControl: false }).setView(MAP_CENTER, MAP_ZOOM_LEVEL);
 
     // Add zoom control with a custom position at the bottom left of the map
     map.addControl(L.control.zoom({ position: 'bottomleft' }));
 
     setBorders(map);
     // Return the map object for possible further manipulation outside this function
     return map;
 }
 
 
 function setBorders(map) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    d3.json('/project-2024-datatouille/data/world-administrative-boundaries-filtered.geojson').then(function(data) {
        L.geoJSON(data, {
            onEachFeature: function(feature, layer) {
                layer.on('click', function(e) {
                    currentEntity = feature.properties.name;
                    updateCountryData(currentEntity);
                    document.querySelector('.container').style.display = 'block';
                    var bounds = layer.getBounds();
                    map.fitBounds(bounds);
                    uncollapseFilterPanel();
                });
            },
            style: function(feature) {
                let isoCode = feature.properties.iso_3166_1_alpha_2_codes ? feature.properties.iso_3166_1_alpha_2_codes.toLowerCase() : null;
                if (!isoCode) {
                    return {
                        color: 'grey',
                        weight: 1,
                        fillOpacity: 0.1
                    };
                }
                let patternUrl = '../static/images/country_flags/' + isoCode + '.png';

                return {
                    color: 'grey',
                    weight: 1,
                    fillOpacity: 0.1
                };
            }
        }).addTo(map);
    }).catch(function(error) {
        console.error('Error loading GeoJSON:', error);
    });
}


 function setBorders2(map) {
   // Add a tile layer
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);
 
   // Load GeoJSON data
   d3.json('/project-2024-datatouille/data/world-administrative-boundaries-filtered.geojson').then(function(data) {
       // Process each feature to add custom pattern
       L.geoJSON(data, {
           onEachFeature: function(feature, layer) {
               layer.on('click', function(e) {
                   currentEntity = feature.properties.name;
                   updateCountryData(currentEntity);
                   document.querySelector('.container').style.display = 'block';
                   // Zoom to the bounds of the clicked feature
                   var bounds = layer.getBounds();
                   map.fitBounds(bounds);
                   uncollapseFilterPanel();
               });
           },
           style: function(feature) {
               // Get the ISO alpha-2 code and convert it to lower case
               if (!feature.properties.iso_3166_1_alpha_2_codes) {
                   return {
                       color: 'grey', // Boundary color
                       weight: 1, // Boundary weight
                       fillOpacity: 0.1 // Adjust fill opacity as needed
                   };
               }
               let isoCode = feature.properties.iso_3166_1_alpha_2_codes.toLowerCase();
               console.log(isoCode);
               // Define the pattern
               
               let pattern = new L.Pattern({
                   width: 50,
                   height: 50
               });
               /*
               pattern.addShape(new L.PatternShape({
                   type: 'image',
                   url: '../static/images/country_flags/' + isoCode + '.png',
                   width: 50,
                   height: 50
               }));
               //console.log(pattern)
               console.log('Adding pattern to map:', pattern);
                try {
                    pattern.addTo(map);
                } catch (error) {
                    console.error('Error adding pattern to map:', error);
                }
                */
               return {
                   //fillPattern: pattern,
                   color: 'grey', // Boundary color
                   weight: 1, // Boundary weight
                   fillOpacity: 0.1 // Adjust fill opacity as needed
               };
           }
       }).addTo(map);
   }).catch(function(error) {
       console.error('Error loading GeoJSON:', error);
   });
 }
 
 // Initialize the map
 initializeMap();
 
 // Set up SVG overlay for data visualization
 const { svg, g } = setupSvgOverlay();
 
 // Add toggle panel control
 addTogglePanelControl();
 
 
 function setupSvgOverlay() {
     const svg = d3.select(map.getPanes().overlayPane).append("svg");
     const g = svg.append("g").attr("class", "leaflet-zoom-hide");
     return { svg, g };
 }
 
 
 
 function clearMapEntries() {
     // Assuming markers are added to a specific layer or directly to the map
     map.eachLayer(function(layer) {
         if (layer instanceof L.CircleMarker) { // Only remove CircleMarkers, preserving base tiles and other layers
             map.removeLayer(layer);
         }
     });
 }
 
 function updateMapCenter() {
     if (currentFilters.city && currentFilters.city in cityCoordinates) {
         // Zoom closer for city
         map.setView(cityCoordinates[currentFilters.city], 11);
     } else if (currentFilters.country && countryDetails[currentFilters.country]) {
         // Country level zoom
         map.setView(countryDetails[currentFilters.country].coords, countryDetails[currentFilters.country].zoom);
     } else if (currentFilters.continents && currentFilters.continents.length === 1 && continentCoordinates[currentFilters.continents[0]]) {
         // Continent level zoom
         map.setView(continentCoordinates[currentFilters.continents[0]].coords, continentCoordinates[currentFilters.continents[0]].zoom);
     } else if (currentFilters.continents && currentFilters.continents.length > 1) {
         // More general view for multiple continents
         map.setView([0, 0], 3); // World view
     } else if ( currentFilters.awards || currentFilters.priceRange || currentFilters.ambiance || currentFilters.cuisine) {
         // More general view for multiple continents
         return;
     } else {
         // Default view
         map.setView(MAP_CENTER, MAP_ZOOM_LEVEL);
     }
 }
 
 
 
 function projectPoint(x, y) {
     return map.latLngToLayerPoint(new L.LatLng(y, x));
 }
 
 function applyLatLngToLayer(d) {
     return projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]);
 }
 
 function addTogglePanelControl() {
     const toggleButton = document.getElementById('toggle-filter-button');
     if (toggleButton) {
         toggleButton.addEventListener('click', function() {
             toggleFilterPanel();
         });
     }
 }
 function uncollapseFilterPanel() {
    const panel = document.getElementById('filter-panel');
    const mapArea = document.getElementById('map');
    const panelWidth = '500px';  // Set the panel width

    if (panel.classList.contains('collapsed')) {
        panel.style.right = '0';
        mapArea.style.width = `calc(100% - ${panelWidth})`;
        document.getElementById('toggle-filter-button').style.right = panelWidth;
        panel.classList.remove('collapsed');

        map.invalidateSize();  // Ensure the map adjusts to new dimensions
    }
}

 function toggleFilterPanel() {
     const panel = document.getElementById('filter-panel');
     const mapArea = document.getElementById('map');
     const panelWidth = '500px';  // Set the panel width
 
     if (panel.classList.contains('collapsed')) {
         panel.style.right = '0';
         mapArea.style.width = `calc(100% - ${panelWidth})`;
         document.getElementById('toggle-filter-button').style.right = panelWidth;
         panel.classList.remove('collapsed');
     } else {
         panel.style.right = `-${panelWidth}`;
         mapArea.style.width = '100%';
         document.getElementById('toggle-filter-button').style.right = '0';
         panel.classList.add('collapsed');
     }
 
     map.invalidateSize();  // Ensure the map adjusts to new dimensions
 }



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
    document.getElementById("country-name").innerHTML = "<h2>" + country + "</h2>";

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
    d3.json("../data/prices_country.json").then(function(data) {
        // Filter data for the selected country
        let countryData = data[country] || [];

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
