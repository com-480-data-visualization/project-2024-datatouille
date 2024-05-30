// Define constants for configuration
const MAP_CENTER = [46.519653, 6.632273];
const MAP_ZOOM_LEVEL = 9;
const DATA_URL = "/project-2024-datatouille/data/michelin_restaurants.geojson";

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

const colorThemes = {
    default: {
        "Bib Gourmand": "green",
        "1 Star": "blue",
        "2 Stars": "yellow",
        "3 Stars": "red",
        "default": "gray"
    },
    pastel: {
        "Bib Gourmand": "#77dd77",
        "1 Star": "#779ecb",
        "2 Stars": "#fdfd96",
        "3 Stars": "#ff6961",
        "default": "#d3d3d3"
    },
    vibrant: {
        "Bib Gourmand": "#e63946",
        "1 Star": "#f4a261",
        "2 Stars": "#2a9d8f",
        "3 Stars": "#264653",
        "default": "#e76f51"
    },
    coolTones: {
        "Bib Gourmand": "#4A235A", // Deep purple, sophisticated and rich for Bib Gourmand
        "1 Star": "#5D6D7E",      // Slate gray, elegant and understated for 1 Star
        "2 Stars": "#2980B9",     // Strong blue, vivid and striking for 2 Stars
        "3 Stars": "#154360",     // Dark navy, bold and authoritative for 3 Stars
        "default": "#ABB2B9"      // Silver gray, neutral and versatile for other categories
    },
    alpinePalette: {
        "Bib Gourmand": "#D35400", // Pumpkin Orange: Stands out against greens and is distinct.
        "1 Star": "#2980B9",      // Strong Blue: Offers good visibility against earth tones.
        "2 Stars": "#F1C40F",     // Sunflower Yellow: Bright and very visible against darker backgrounds.
        "3 Stars": "#C0392B",     // Pomegranate Red: Rich and noticeable against varied terrain.
        "default": "#7F8C8D"      // Asbestos: Neutral gray that blends subtly when needed.
    }
        
};

// Initialize heatmap configuration
const cfg = {
    "radius": 0.15,
    "maxOpacity": .8,
    "scaleRadius": true,
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
};

let currentTheme = 'default'; // Track the currently selected theme

// Initialize and configure the map
let map; // Declare a variable to hold the map instance.
let currentTileLayer; // Declare a variable to hold the current tile layer, allowing easy changes later.
let isHeatmapActive = false;

let heatmapLayer = new HeatmapOverlay(cfg); // Initialize heatmap layer

function initializeMap() {
    // Initialize the Leaflet map on the 'map' div, set the view to the predefined center and zoom level
    map = L.map('map', { zoomControl: false }).setView(MAP_CENTER, MAP_ZOOM_LEVEL);

    // Add zoom control with a custom position at the bottom left of the map
    map.addControl(L.control.zoom({ position: 'bottomleft' }));

    // Set the initial tile layer to 'default' using the setTileLayer function
    setTileLayer('default');

    // Listen for zoomend events to toggle between heatmap and circle markers
    map.on('zoomend', handleZoomLevelChange);

    // Return the map object for possible further manipulation outside this function
    return map;
}

function setTileLayer(theme) {
    // Define URLs for various map themes using OpenStreetMap data
    const tileUrls = {
        default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Standard OpenStreetMap tiles
        pastel: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // HOT style (Humanitarian OSM Team), more colorful and distinct
        vibrant: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Reuse default tiles, assume vibrant styling via CSS
        coolTones: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        alpinePalette: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // cycle-oriented render
    };

    // Attribution string required by OpenStreetMap for map data usage
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    // Retrieve the URL for the selected theme
    const tileUrl = tileUrls[theme];

    // Remove the current tile layer from the map if it exists (to switch to a new theme)
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }

    // Create a new tile layer with the selected theme's URL and add it to the map
    currentTileLayer = L.tileLayer(tileUrl, { attribution });
    currentTileLayer.addTo(map);
}

// Initialize the map
initializeMap();

// Set up SVG overlay for data visualization
const { svg, g } = setupSvgOverlay();

// Load and process GeoJSON data
loadAndProcessData(DATA_URL);

// Add toggle panel control
addTogglePanelControl();

// Initialize filter event listeners
initializeFilterControls();
updateRatingDisplay(); // Set initial rating display values
updateSliderBackground(document.getElementById('rating-min'), document.getElementById('rating-max'));

function applyThemeColors(theme) {
    const themeColors = colorThemes[theme] || colorThemes['default'];
    
    const awardTypes = {
        'bib-gourmand': 'Bib Gourmand',
        'one-star': '1 Star',
        'two-stars': '2 Stars',
        'three-stars': '3 Stars'
    };
    
    for (const [id, award] of Object.entries(awardTypes)) {
        const circle = document.getElementById(`circle-${id}`);
        if (circle) {
            circle.style.backgroundColor = themeColors[award] || themeColors['default'];
        }
    }
}

// Call the function initially to set the theme
applyThemeColors(currentTheme);


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
    updateHeatmap(featuresData);

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    // First check for name filter before updating map view generally
    if (currentFilters.name) {
        const nameFilterLower = currentFilters.name.toLowerCase();
        const matchedData = featuresData.find(d => d.properties.Name.toLowerCase().includes(nameFilterLower));
        if (matchedData) {
            const coordinates = matchedData.geometry.coordinates;
            map.setView(new L.LatLng(coordinates[1], coordinates[0]), 13);
        }
    } else {
        // Update map center based on other filters
        updateMapCenter();
    }

    // Check the current zoom level and update the respective layers
    const currentZoom = map.getZoom();
    if (currentZoom <= 6) {
        clearMapEntries();
        updateHeatmap(featuresData);
    } else {
        clearMapEntries();
        featuresData.forEach(d => generateEntry(d));
        map.on("viewreset", () => resetView(path, featuresData));
        resetView(path, featuresData);
    }

    // Update heatmap or circle markers based on the current zoom level
    handleZoomLevelChange();
}

function updateHeatmap(data) {
    const heatmapData = {
        data: data.map(d => ({
            lat: d.geometry.coordinates[1],
            lng: d.geometry.coordinates[0],
            count: 1
        }))
    };

    heatmapLayer.setData(heatmapData);
}

function handleZoomLevelChange() {
    const currentZoom = map.getZoom();
    if (currentZoom <= 6) {
        if (!isHeatmapActive) {
            clearMapEntries();
            heatmapLayer.addTo(map);
            const featuresData = applyFilters(allFeaturesData, currentFilters);
            updateHeatmap(featuresData);
            isHeatmapActive = true;
        }
    } else {
        if (isHeatmapActive) {
            map.removeLayer(heatmapLayer);
            clearMapEntries();
            const featuresData = applyFilters(allFeaturesData, currentFilters);
            const transform = d3.geoTransform({ point: projectPoint });
            const path = d3.geoPath().projection(transform);

            featuresData.forEach(d => generateEntry(d));

            map.on("viewreset", () => resetView(path, featuresData));
            resetView(path, featuresData);
            isHeatmapActive = false;
        }
    }
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
     .attr("r", getRadius)
     .style("fill", d => getFillColor(d.properties.Award));
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
                  // Close the current popup and reset the last clicked marker
                  marker.closePopup();
                  lastClicked = null;

                  // Set default zoom level, overridden by specific filters if they are set
                  let zoomLevel = 9; // Default zoom level for no specific filter set
                  // Adjust zoom level based on the most specific filter set
                  if (currentFilters.name) {
                    zoomLevel = 12; // Higher zoom for specific name filter
                  } else if (currentFilters.city && currentFilters.city in cityCoordinates) {
                    zoomLevel = 11; // City level zoom
                  } else if (currentFilters.country && countryDetails[currentFilters.country]) {
                    zoomLevel = countryDetails[currentFilters.country].zoom; // Country specific zoom from details
                  }

                  // Set view with the determined zoom level
                  map.setView(latLng, zoomLevel);
              }
          });
}

function createPopupContent(datapoint) {
    const awardImageHtml = getAwardImage(datapoint.properties.Award);

    const facilitiesHtml = datapoint.properties.FacilitiesAndServices
        .split(',')
        .map(facility => `<li>${facility.trim()}</li>`)
        .join('');

    const googleRating = datapoint.properties.google_rating === 0 
        ? 'No Ratings Available' 
        : datapoint.properties.google_rating;

    return `
        <h2>${datapoint.properties.Name}</h2>
        <p><strong>Country:</strong> ${datapoint.properties.Country}</p>
        <p><strong>City:</strong> ${datapoint.properties.City}</p>
        <p><strong>Award:</strong> ${awardImageHtml}</p>
        <p><strong>Cuisine:</strong> ${datapoint.properties.PrimaryCuisine}</p>
        <p><strong>Price:</strong> ${datapoint.properties.Price}</p>
        <p><strong>Address:</strong> ${datapoint.properties.Address}</p>
        <p><strong>Google Ratings:</strong> ${googleRating}</p>
        <p><strong>Facilities and Services:</strong></p>
        <div class="selected-facility">
            <ul>${facilitiesHtml}</ul>
        </div>
    `;
}



function getAwardImage(award) {
    const baseImgPath = "/project-2024-datatouille/static/images/";
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

function updateTheme(theme) {
    currentTheme = theme;
    applyThemeColors(currentTheme);
    setTileLayer(theme);
    processFilteredData(); // Reapply the data processing to refresh map with new colors
}

document.getElementById('colorThemeSelector').addEventListener('click', function(event) {
    this.size = this.length;  // Expand dropdown
}, false);

document.addEventListener('click', function(event) {
    const selectElement = document.getElementById('colorThemeSelector');
    if (event.target !== selectElement) {
        selectElement.size = 0;  // Collapse dropdown when clicking outside
    }
});

document.getElementById('colorThemeSelector').addEventListener('focus', function() {
    this.style.backgroundColor = "#f0f0f0"; // Lightens the background on focus
});

document.getElementById('colorThemeSelector').addEventListener('blur', function() {
    this.style.backgroundColor = ""; // Resets the background when focus is lost
});

document.getElementById('colorThemeSelector').addEventListener('change', function() {
    // This could trigger a visual confirmation that the theme has been changed, e.g., a flash or border glow
    this.classList.add('theme-changed');
    setTimeout(() => {
        this.classList.remove('theme-changed');
    }, 500);
});

function getFillColor(award) {
    const themeColors = colorThemes[currentTheme] || colorThemes['default'];
    return themeColors[award] || themeColors['default'];
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

function formatCountryName(countryName) {
    // Define a mapping dictionary for special cases
    const countryMappings = {
        "china": "China Mainland",
        "hong kong": "Hong Kong SAR China",
        "korea": "South Korea",
        "uae": "United Arab Emirates",
        "czechia": "Czech Republic",
        "macau": "Macau SAR China",
        "uk": "United Kingdom",
        "turkey": "Türkiye",
        "england": "United Kingdom",
        "scotland": "United Kingdom"
    };

    // Convert the input to lowercase and trim whitespace
    const normalizedCountryName = countryName.trim().toLowerCase();

    // Check if the input matches any special case
    if (countryMappings.hasOwnProperty(normalizedCountryName)) {
        return countryMappings[normalizedCountryName];
    }

    // Define a list of acronyms and special cases that should remain in uppercase
    const specialCases = ["USA"];

    // Split the country name into words
    const words = normalizedCountryName.split(/\s+/);

    // Capitalize the first letter of each word
    const formattedWords = words.map(word => {
        // Check if the word is in the list of special cases
        if (specialCases.includes(word.toUpperCase())) {
            return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the words back into a single string
    return formattedWords.join(' ');
}

function updateRatingDisplay() {
    const minSlider = document.getElementById('rating-min');
    const maxSlider = document.getElementById('rating-max');
    const minDisplay = document.getElementById('rating-min-display');
    const maxDisplay = document.getElementById('rating-max-display');

    const minValue = parseFloat(minSlider.value);
    const maxValue = parseFloat(maxSlider.value);

    // Ensure min does not exceed max
    if (minValue > maxValue) {
        minSlider.value = maxValue;
        minDisplay.innerText = maxValue.toFixed(1);
    } else {
        minDisplay.innerText = minValue.toFixed(1);
    }

    // Ensure max does not go below min
    if (maxValue < minValue) {
        maxSlider.value = minValue;
        maxDisplay.innerText = minValue.toFixed(1);
    } else {
        maxDisplay.innerText = maxValue.toFixed(1);
    }

    // Update slider background
    updateSliderBackground(minSlider, maxSlider);
}

function updateSliderBackground(minSlider, maxSlider) {
    const min = parseFloat(minSlider.value);
    const max = parseFloat(maxSlider.value);

    const range = maxSlider.max - maxSlider.min;
    const minPercent = ((min - minSlider.min) / range) * 100;
    const maxPercent = ((max - maxSlider.min) / range) * 100;

    const sliderFill = document.getElementById('slider-fill');
    sliderFill.style.left = `${minPercent}%`;
    sliderFill.style.width = `${maxPercent - minPercent}%`;
}



// Filter part
function initializeFilterControls() {
    document.getElementById('apply-filters').addEventListener('click', function() {
        let selectedCuisines = Array.from(document.querySelectorAll('.cuisine-chip .cuisine-text')).map(span => span.textContent.trim());
        // Check if any cuisines are selected; if none, set to null
        selectedCuisines = selectedCuisines.length > 0 ? selectedCuisines : null;
        const selectedAmbiances = collectAmbianceTags();
        const countryInputElement = document.getElementById('country-input');
        const ratingMinValue = parseFloat(document.getElementById('rating-min').value);
        const ratingMaxValue = parseFloat(document.getElementById('rating-max').value);
        currentFilters = {
            country: countryInputElement.value ? formatCountryName(countryInputElement.value) : null,
            city: document.getElementById('city-input').value || null,
            name: document.getElementById('name-input').value || null,
            awards: (tempAwards = Array.from(document.querySelectorAll('#filter-form input[name="award"]:checked')).map(input => input.value), tempAwards.length > 0 ? tempAwards : null),
            continents: Array.from(document.querySelectorAll('#filter-form input[name="continent"]:checked')).map(input => input.value),
            priceRange: document.getElementById('price-range').value || null,
            facilitiesAndServices: selectedAmbiances,
            cuisine: selectedCuisines,
            ratingMin: ratingMinValue === 0 ? null : ratingMinValue,
            ratingMax: ratingMaxValue === 5 ? null : ratingMaxValue // Add rating filter
        };
        console.log('Applying filters:', currentFilters);
        processFilteredData(); // Reload data with new filters
    });
}
// Filter part

// CUISINE
const predefinedCuisines = [
    'Afghan', 'Alpine', 'Alsatian', 'American', 'Andalusian', 'Anago / Saltwater Eel', 'Apulian', 'Argentinian', 'Asian',
    'Asian and Western', 'Asian Contemporary', 'Asian Influences', 'Austrian', 'Bakery', 'Balkan', 'Barbecue', 'Basque',
    'Bavarian', 'Beef', 'Beijing Cuisine', 'Belgian', 'Brazilian', 'Breton', 'British Contemporary', 'Bulgogi', 'Burmese',
    'Calabrian', 'Californian', 'Campanian', 'Cantonese', 'Cantonese Roast Meats', 'Caribbean', 'Catalan', 'Central Asian',
    'Chao Zhou', 'Chicken Specialities', 'Chinese', 'Chinese Contemporary', 'Chiu Chow', 'Classic Cuisine', 'Classic French',
    'Colombian', 'Congee', 'Contemporary', 'Corsican', 'Country cooking', 'Creole', 'Creative', 'Creative British', 'Creative French',
    'Croatian', 'Crab Specialities', 'Cuban', 'Cuisine from Abruzzo', 'Cuisine from Basilicata', 'Cuisine from Lazio',
    'Cuisine from Romagna', 'Cuisine from South West France', 'Cuisine from the Aosta Valley', 'Cuisine from the Marches',
    'Cuisine from Valtellina', 'Czech', 'Danish', 'Deli', 'Dim Sum', 'Doganitang', 'Dongbei', 'Dumplings', 'Dubu', 'Dwaeji-gukbap',
    'Emilian', 'Emirati Cuisine', 'Ethiopian', 'European', 'European Contemporary', 'Farm to table', 'Filipino', 'Finnish',
    'French', 'French Contemporary', 'Friulian', 'Fujian', 'Fugu / Pufferfish', 'Fusion', 'Galician', 'Gastropub', 'Gejang',
    'German', 'Greek', 'Grills', 'Gomtang', 'Hang Zhou', 'Hakkanese', 'Home Cooking', 'Hotpot', 'Huaiyang', 'Hubei',
    'Hunanese', 'Indian', 'Indian Vegetarian', 'Indonesian', 'Innovative', 'International', 'Iranian', 'Iraqi', 'Irish',
    'Israeli', 'Italian', 'Italian-American', 'Italian Contemporary', 'Izakaya', 'Jiangzhe', 'Japanese', 'Japanese Contemporary',
    'Jokbal', 'Korean', 'Korean Contemporary', 'Kushiage', 'Lamb dishes', 'Latin American', 'Lebanese', 'Ligurian',
    'Lombardian', 'Macanese', 'Malaysian', 'Mandu', 'Mantuan', 'Meats and Grills', 'Memil-guksu', 'Mexican', 'Middle Eastern',
    'Modern British', 'Modern Cuisine', 'Modern French', 'Naengmyeon', 'Nepali', 'Ningbo', 'Noodles', 'Noodles and Congee',
    'Norwegian', 'Northern Thai', 'North African', 'Obanzai', 'Oden', 'Okonomiyaki', 'Onigiri', 'Organic', 'Pakistani',
    'Pasta', 'Peking Duck', 'Peranakan', 'Peruvian', 'Piedmontese', 'Piedmontese', 'Pies and pastries', 'Pizza', 'Polish',
    'Pork', 'Portuguese', 'Provençal', 'Regional Cuisine', 'Roman', 'Russian', 'Sardine Specialities', 'Sardinian', 'Savoyard',
    'Scandinavian', 'Seafood', 'Seasonal Cuisine', 'Seolleongtang', 'Shandong', 'Sharing', 'Shanghai', 'Shanghainese', 'Shojin',
    'Sicilian', 'Singaporean', 'Singaporean and Malaysian', 'Sichuan', 'Smørrebrød', 'Soba', 'South African', 'South East Asian',
    'South Indian', 'South Tyrolean', 'Southern', 'Southern Thai', 'Spanish', 'Spanish Contemporary', 'Steakhouse', 'Street Food',
    'Sujebi', 'Swedish', 'Swiss', 'Taiwanese', 'Taiwanese contemporary', 'Taizhou', 'Tempura', 'Teochew', 'Teppanyaki',
    'Tex-Mex', 'Thai', 'Thai contemporary', 'Thai-Chinese', 'Tibetan', 'Tonkatsu', 'Traditional British', 'Traditional Cuisine',
    'Turkish', 'Tuscan', 'Udon', 'Umbrian', 'Unagi / Freshwater Eel', 'Vegan', 'Vegetarian', 'Venetian', 'Vietnamese',
    'Vietnamese Contemporary', 'World Cuisine', 'Xibei', 'Xinjiang', 'Yakitori', 'Yoshoku', 'Yukhoe', 'Yunnanese', 'Zhejiang'
];

document.getElementById('cuisine-input').addEventListener('input', function() {
    const input = this.value;
    const cuisineList = document.getElementById('cuisine-list');
    cuisineList.innerHTML = ''; // Clear existing suggestions

    if (input.length > 0) {
        const filteredCuisines = predefinedCuisines.filter(cuisine =>
            cuisine.toLowerCase().includes(input.toLowerCase())
        );

        filteredCuisines.forEach(function(cuisine) {
            const div = document.createElement('div');
            div.textContent = cuisine;
            div.className = 'suggestion-item';
            div.onclick = function() {
                document.getElementById('cuisine-input').value = '';
                addSelectedCuisine(cuisine);
                cuisineList.innerHTML = ''; // Clear suggestions after selection
            };
            cuisineList.appendChild(div);
        });
    }
});

function addSelectedCuisine(cuisine) {
    const container = document.getElementById('selected-cuisines');
    const chip = document.createElement('div');
    chip.className = 'cuisine-chip';

    const textSpan = document.createElement('span');
    textSpan.textContent = cuisine;
    textSpan.className = 'cuisine-text';  // A specific class for the text part

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.className = 'close-btn';
    closeBtn.onclick = function() {
        container.removeChild(chip);
    };

    chip.appendChild(textSpan);
    chip.appendChild(closeBtn);
    container.appendChild(chip);
}

// Hide suggestions when clicking outside
document.addEventListener('click', function(event) {
    const cuisineInput = document.getElementById('cuisine-input');
    const cuisineList = document.getElementById('cuisine-list');
    if (!cuisineInput.contains(event.target)) {
        cuisineList.innerHTML = '';
    }
});

// CUISINE

// Ambiance
document.getElementById('ambiance-dropdown').addEventListener('change', function() {
    const selectedOption = this.value;
    if (selectedOption) {
        addAmbianceTag(selectedOption);
        this.value = ''; // Reset dropdown after selection
    }
});

function addAmbianceTag(ambiance) {
    const container = document.getElementById('ambiance-tag-container');
    // Check if the tag already exists to prevent duplicate tags
    if (Array.from(container.children).some(tag => tag.textContent.slice(0, -2) === ambiance)) {
        alert('Ambiance already added!');
        return false;
    }

    // Create a new tag element
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = ambiance + ' x';
    
    // Add an onclick event to the tag for removal functionality
    tag.onclick = function() {
        container.removeChild(this);  // Remove the tag from the container
        updateFilters();  // Update the filters based on current tags
    };

    // Append the newly created tag to the container
    container.appendChild(tag);
    return true;
}

function collectAmbianceTags() {
    const tags = Array.from(document.getElementById('ambiance-tag-container').children);
    const ambiances = tags.map(tag => tag.textContent.slice(0, -2));
    return ambiances.length > 0 ? ambiances : null;
}
// Ambiance

function applyFilters(data, filters) {
    return data.filter(d => {
        if (filters.country && d.properties.Country !== filters.country) return false;
        if (filters.city && d.properties.City !== filters.city) return false;
        if (filters.name && !d.properties.Name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.awards && filters.awards.length > 0 && !filters.awards.includes(d.properties.Award)) return false;
        if (filters.continents && filters.continents.length > 0 && !filters.continents.includes(d.properties.Continent)) return false;
        if (filters.priceRange && String(d.properties.currentPrice) !== filters.priceRange) return false;
        // New filter condition for cuisine
        if (filters.cuisine && filters.cuisine.length > 0 && !filters.cuisine.some(cuisine => d.properties.PrimaryCuisine.toLowerCase() === cuisine.toLowerCase())) return false;
        if (filters.facilitiesAndServices && filters.facilitiesAndServices.length > 0) {
            const facilitiesList = d.properties.FacilitiesAndServices.split(',').map(facility => facility.trim().toLowerCase());
            // Ensure every selected facility/service is included in the facilities list
            if (!filters.facilitiesAndServices.every(facility => facilitiesList.includes(facility.toLowerCase()))) return false;
        }
        // New filter condition for rating
        if (filters.ratingMin !== null && d.properties.google_rating < filters.ratingMin) return false;
        if (filters.ratingMax !== null && d.properties.google_rating > filters.ratingMax) return false;
        return true;
        
    });
}
