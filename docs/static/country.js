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
  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Load GeoJSON data
  d3.json('/project-2024-datatouille/data/world-administrative-boundaries.geojson').then(function(data) {
      // Process each feature to add custom pattern
      L.geoJSON(data, {
          onEachFeature: function(feature, layer) {
              layer.on('click', function(e) {
                  currentEntity = feature.properties.name;
                  alert('You clicked on ' + feature.properties.name);

                  // Zoom to the bounds of the clicked feature
                  var bounds = layer.getBounds();
                  map.fitBounds(bounds);
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
              //console.log(isoCode);
              // Define the pattern
              /*
              let pattern = new L.Pattern({
                  width: 50,
                  height: 50
              });

              pattern.addShape(new L.PatternShape({
                  type: 'image',
                  url: '/static/images/country_flags/' + isoCode + '.png',
                  width: 50,
                  height: 50
              }));

              pattern.addTo(map);
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