const map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
}).addTo(map);

const fileInput = document.getElementById("gpxFileInput");

const selectedCircleColor = "fuchsia";
const selectedRowColor = "plum";

// Array to store all circle markers
const circleMarkers = [];

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const gpxData = e.target.result;

      new L.GPX(gpxData, {
        async: true,
        polyline_options: { color: "transparent" },
        markers: {
          startIcon: "images/end-pin.png",
          endIcon: "images/end-pin.png",
        },
      })
        .on("addline", (event) => {
          const points = event.line.getLatLngs();
          const container = document.getElementById("list-container");

          points.forEach((point) => {
            // Add a row for each track point
            const { lat, lng, meta } = point;
            const row = createRow({ lat, lng, meta });
            container.appendChild(row);

            // Create a circle marker for each point
            const circleMarker = L.circleMarker([lat, lng], {
              radius: 3,
              color: "blue",
            })
              .on("mouseover", function () {
                circleMarker.setStyle({ radius: 6 });
              })
              .on("mouseout", function () {
                if (circleMarker.options.color !== selectedCircleColor) {
                  circleMarker.setStyle({ radius: 3 });
                }
              })
              .on("click", function (e) {
                // Prevent the map from handling the click event
                e.originalEvent.stopPropagation();

                // Reset all markers and rows
                resetStyles();

                // Set the style of the clicked marker and row
                setStyles({ circleMarker, row });

                // Scroll the container to the highlighted row
                row.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              })
              .addTo(map);

            // Store the marker in an array for reference
            circleMarkers.push({ marker: circleMarker, row });

            // Add click event to the row to highlight the corresponding marker
            row.addEventListener("click", function (e) {
              // Reset style for all markers and rows
              resetStyles();

              // Set the style of the clicked marker and row
              setStyles({ circleMarker, row });

              // Scroll the list to the highlighted row
              // container.scrollTop = row.offsetTop - container.offsetTop;
            });
          });
        })
        .on("loaded", function (e) {
          map.fitBounds(e.target.getBounds());
        })
        .addTo(map);
    };

    reader.readAsText(file);
  }
});

const createRow = ({ lat, lng, meta }) => {
  const shortDate = new Date(meta.time).toLocaleDateString();
  const shortTime = new Date(meta.time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const row = document.createElement("p");
  row.textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lng.toFixed(6)}, ele: ${
    meta.ele
  }, time: ${shortTime}(${shortDate})`;
  const id = `row-${lat}-${lng}`;
  row.id = id;
  row.classList.add("row");

  return row;
};

const resetStyles = () => {
  circleMarkers.forEach((item) => {
    item.marker.setStyle({ color: "blue", radius: 3 });
    item.row.style.backgroundColor = "";
  });
};

const setStyles = ({ circleMarker, row }) => {
  circleMarker.setStyle({ color: selectedCircleColor, radius: 6 });
  row.style.backgroundColor = selectedRowColor;
};
