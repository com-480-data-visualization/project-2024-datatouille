 // Initialize Leaflet map
 var map = L.map('map').setView([0, 0], 2);

 // Add a tile layer
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

 // Load GeoJSON data
 d3.json('/project-2024-datatouille/data/world-administrative-boundaries.geojson').then(function(data) {
   L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
          layer.on('click', function(e) {
            // You can define any action you want here
            alert('You clicked on ' + feature.properties.name);
          });
        },
        style: function(feature) {
          return {
            color: 'red', // Boundary color
            weight: 1, // Boundary weight
            fillOpacity: 0.5 // No fill
          };
        }
      }).addTo(map);
      /*
      data.features.forEach(function(feature) {
        isoCode = feature.properties.iso_3166_1_alpha_2_codes;
        if (isoCode == null) {
          return;
        }
        console.log(isoCode.toLowerCase());
        var isoCode = feature.properties.iso_3166_1_alpha_2_codes.toLowerCase();
        var pattern = '<pattern id="flag-' + isoCode + '" patternUnits="userSpaceOnUse" width="32" height="32">';
        pattern += '<image href="/project-2024-datatouille/static/images/country_flags/' + isoCode + '.png" x="0" y="0" width="32" height="32" />';
        pattern += '</pattern>';
        map._container.querySelector('svg').innerHTML += pattern;
      });
      */
 });