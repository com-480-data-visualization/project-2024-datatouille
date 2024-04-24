// Define constants for configuration
const MAP_CENTER = [46.519653, 6.632273];
const MAP_ZOOM_LEVEL = 10;
const DATA_URL = "../data/michelin_restaurants.geojson";

let currentFilters = {}; // Store current filters globally
let allFeaturesData = []; // Cache all features data

const continentCoordinates = {
    'Asia': { coords: [34.0479, 100.6197], zoom: 4 },  // Central Asia, broad perspective
    'Europe': { coords: [50.1109, 10.1503], zoom: 5 },  // Central Europe, Germany
    'North America': { coords: [37.6, -95.665], zoom: 4 },  // Near the geographical center of the contiguous United States
    'South America': { coords: [-8.7832, -55.4915], zoom: 4 }  // Central Brazil, broad perspective
};

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
    'Türkiye': { coords: [39.9334, 32.8597], zoom: 6 },
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

const cityCoordinates = {
    'Paris': [48.8566, 2.3522], 'Lyon': [45.7640, 4.8357], 'Marseille': [43.2965, 5.3698],
    'Tokyo': [35.6895, 139.6917], 'Osaka': [34.6937, 135.5023], 'Kyoto': [35.0116, 135.7681],
    'Rome': [41.9028, 12.4964], 'Milan': [45.4642, 9.1900], 'Florence': [43.7696, 11.2558],
    'New York': [40.7128, -74.0060], 'San Francisco': [37.7749, -122.4194], 'Chicago': [41.8781, -87.6298],
    'Berlin': [52.5200, 13.4050], 'Munich': [48.1351, 11.5820], 'Hamburg': [53.5511, 9.9937],
    'Madrid': [40.4168, -3.7038], 'Barcelona': [41.3851, 2.1734], 'Seville': [37.3891, -5.9845],
    'London': [51.5074, -0.1278], 'Edinburgh': [55.9533, -3.1883], 'Manchester': [53.4808, -2.2426],
    'Brussels': [50.8503, 4.3517], 'Bruges': [51.2093, 3.2247], 'Antwerp': [51.2194, 4.4025],
    'Zurich': [47.3769, 8.5417], 'Geneva': [46.2044, 6.1432], 'Basel': [47.5596, 7.5886],
    'Shanghai': [31.2304, 121.4737], 'Beijing': [39.9042, 116.4074], 'Guangzhou': [23.1291, 113.2644],
    'Bangkok': [13.7563, 100.5018], 'Chiang Mai': [18.7883, 98.9853], 'Phuket': [7.8804, 98.3923],
    'Amsterdam': [52.3676, 4.9041], 'Rotterdam': [51.9244, 4.4777], 'The Hague': [52.0705, 4.3007], 
    'Taipei': [25.0330, 121.5654], 'Taichung': [24.1477, 120.6736], 'Kaohsiung': [22.6273, 120.3014],
    'Hong Kong': [22.3193, 114.1694], 'Singapore': [1.3521, 103.8198], 'Seoul': [37.5665, 126.9780],
    'Lisbon': [38.7223, -9.1393], 'Ottawa': [45.4215, -75.6972], 'Kuala Lumpur': [3.1390, 101.6869],
    'Brasília': [-15.8267, -47.9218], 'Copenhagen': [55.6761, 12.5683], 'Abu Dhabi': [24.4539, 54.3773],
    'Hanoi': [21.0285, 105.8542], 'Dublin': [53.3498, -6.2603], 'Stockholm': [59.3293, 18.0686], 'Vienna': [48.2082, 16.3738], 
    'Zagreb': [45.8150, 15.9819], 'Istanbul': [41.0082, 28.9784], 'Macau': [22.1987, 113.5439], 'Porto': [41.1579, -8.6291], 
    'Bodrum': [37.0343, 27.4305], 'Oslo': [59.9139, 10.7522], 'Athens': [37.9838, 23.7275], 'Ljubljana': [46.0569, 14.5058],
    'Luxembourg City': [49.6116, 6.1319], 'Budapest': [47.4979, 19.0402], 'Buenos Aires': [-34.6037, -58.3816],
    'Warsaw': [52.2297, 21.0122], 'Valletta': [35.8989, 14.5146], 'Helsinki': [60.1699, 24.9384],
    'Tallinn': [59.4370, 24.7536], 'Riga': [56.9496, 24.1052], 'Reykjavik': [64.1466, -21.9426],
    'Prague': [50.0755, 14.4378], 'Belgrade': [44.7866, 20.4489], 'Andorra la Vella': [42.5063, 1.5218]
};

// Initialize and configure the map
const map = initializeMap();

// Set up SVG overlay for data visualization
const { svg, g } = setupSvgOverlay();

// Load and process GeoJSON data
loadAndProcessData(DATA_URL);

// Add toggle panel control
addTogglePanelControl();

// Initialize filter event listeners
initializeFilterControls();

function initializeMap() {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const map = L.map('map', {
        zoomControl: false
    }).addLayer(tiles)
      .setView(MAP_CENTER, MAP_ZOOM_LEVEL);

    map.addControl(L.control.zoom({ position: 'bottomleft' }));
    return map;
}

function setupSvgOverlay() {
    const svg = d3.select(map.getPanes().overlayPane).append("svg");
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");
    return { svg, g };
}

function loadAndProcessData(url) {
    d3.json(url).then(collection => {
        allFeaturesData = collection.features; // Cache data
        processFilteredData();
    }).catch(err => console.error("Error loading data: ", err));
}

function processFilteredData() {
    const featuresData = applyFilters(allFeaturesData, currentFilters);
    console.log("Filtered Data:", featuresData);

    // Clear existing map entries
    clearMapEntries();

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    featuresData.forEach(d => generateEntry(d));

    map.on("viewreset", () => resetView(path, featuresData));
    resetView(path, featuresData);

    // Update map center based on filters
    updateMapCenter();
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
    } else {
        // Default view
        map.setView(MAP_CENTER, MAP_ZOOM_LEVEL);
    }
}

function resetView(path, featuresData) {
    const bounds = path.bounds({type: "FeatureCollection", features: featuresData}),
          topLeft = bounds[0],
          bottomRight = bounds[1];

    g.attr("transform", `translate(${-topLeft[0] + 50}, ${-topLeft[1] + 50})`)
     .selectAll("circle")
     .data(featuresData)
     .join("circle")
     .attr("cx", d => applyLatLngToLayer(d).x)
     .attr("cy", d => applyLatLngToLayer(d).y)
     .attr("r", getRadius);
}

function generateEntry(datapoint) {
    console.log(datapoint.properties.name);
    const latLng = new L.LatLng(datapoint.geometry.coordinates[1], datapoint.geometry.coordinates[0]);
    const marker = L.circleMarker(latLng, {
        radius: getRadius(),
        fillColor: getFillColor(datapoint.properties.Award),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    setupMarkerInteractions(marker, latLng, datapoint);
}

function setupMarkerInteractions(marker, latLng, datapoint) {
    let lastClicked = null;
    marker.on("mouseover", () => marker.setRadius(getRadius() + 5))
          .on("mouseout", () => marker.setRadius(getRadius()))
          .on("click", () => {
              if (lastClicked !== marker) {
                  map.setView(latLng, 14);
                  lastClicked?.closePopup();
                  lastClicked = marker;
                  marker.bindPopup(createPopupContent(datapoint)).openPopup();
              } else {
                  map.setView(latLng, 10);
                  marker.closePopup();
                  lastClicked = null;
              }
          });
}

function createPopupContent(datapoint) {
    const awardImageHtml = getAwardImage(datapoint.properties.Award);
    return `
        <h2>${datapoint.properties.Name}</h2>
        <p><strong>Country:</strong> ${datapoint.properties.Country}</p>
        <p><strong>City:</strong> ${datapoint.properties.City}</p>
        <p><strong>Award:</strong> ${awardImageHtml}</p>
    `;
}

function getAwardImage(award) {
    const baseImgPath = "../static/images/";
    // Define a structure containing filename and specific width for each award type
    const awards = {
        "Bib Gourmand": { file: "bib_gourmand.jpg", width: 30 },
        "1 Star": { file: "1star.svg.png", width: 20 },
        "2 Stars": { file: "2stars.svg.png", width: 40 },
        "3 Stars": { file: "3stars.svg.png", width: 60 }
    };

    const awardInfo = awards[award] || { file: "website_logo.jpg", width: 20 }; // Provide a default award icon and width
    const altText = `${award || 'Unavailable'} Award`; // Handle missing awards gracefully

    // Construct the image HTML string with dynamic width and consistent height
    return `<img src="${baseImgPath + awardInfo.file}" alt="${altText}" style="width: ${awardInfo.width}px; height: 20px;"> ${award || 'No Award'}`;
}


function getFillColor(award) {
    const colors = {
        "Bib Gourmand": "green",
        "1 Star": "blue",
        "2 Stars": "yellow",
        "3 Stars": "red",
        default: "gray"
    };
    return colors[award] || colors.default;
}

function getRadius() {
    return Math.max(5, Math.min(12, 3 + (map.getZoom() - 10)));
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

function toggleFilterPanel() {
    const panel = document.getElementById('filter-panel');
    const mapArea = document.getElementById('map');
    const panelWidth = '300px';  // Set the panel width

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

function initializeFilterControls() {
    document.getElementById('apply-filters').addEventListener('click', function() {
        currentFilters = {
            country: document.getElementById('country-input').value || null,
            city: document.getElementById('city-input').value || null,
            name: document.getElementById('name-input').value || null,
            awards: Array.from(document.querySelectorAll('#filter-form input[name="award"]:checked')).map(input => input.value),
            continents: Array.from(document.querySelectorAll('#filter-form input[name="continent"]:checked')).map(input => input.value),
            priceRange: document.getElementById('price-range').value || null,
            cuisineType: document.getElementById('cuisine-type-input').value || null,
            ambiance: document.getElementById('ambiance').value || null
        };
        console.log('Applying filters:', currentFilters);
        processFilteredData(); // Reload data with new filters
    });
}

function applyFilters(data, filters) {
    return data.filter(d => {
        if (filters.country && d.properties.Country !== filters.country) return false;
        if (filters.city && d.properties.City !== filters.city) return false;
        if (filters.name && !d.properties.Name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.awards && filters.awards.length > 0 && !filters.awards.includes(d.properties.Award)) return false;
        if (filters.continents && filters.continents.length > 0 && !filters.continents.includes(d.properties.Continent)) return false;
        if (filters.priceRange && d.properties.priceRange !== filters.priceRange) return false;
        if (filters.cuisineType && d.properties.cuisineType !== filters.cuisineType) return false;
        if (filters.ambiance && d.properties.ambiance !== filters.ambiance) return false;
        return true;
    });
}

