const map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
}).addTo(map);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Set the map view to the user's location
      map.setView([latitude, longitude], 13);

      // Optionally, add a marker at the user's location
      // L.marker([latitude, longitude])
      //   .addTo(map)
      //   .bindPopup("You are here")
      //   .openPopup();
    },
    function (error) {
      console.error("Error retrieving geolocation: ", error);
      // Handle error (optional)
    }
  );
} else {
  alert("Geolocation is not supported by this browser.");
}

const selectedCircleColor = "fuchsia";
const selectedRowColor = "plum";

let circleMarkers = []; // Array to store circle markers
let gpxLayer = null;
let gpxData = null;

const fileInput = document
  .getElementById("gpxFileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        gpxData = e.target.result;

        loadGPX(gpxData);
      };

      reader.readAsText(file);
    }
  });

const saveFile = document
  .getElementById("saveGpxFile")
  .addEventListener("click", function () {
    if (gpxData) {
      saveGpxFile(gpxData);
    } else {
      alert("No GPX data available to save!");
    }
  });

function loadGPX(data) {
  // Clear existing layers and markers
  if (gpxLayer) {
    map.removeLayer(gpxLayer);
  }
  circleMarkers.forEach(({ marker }) => map.removeLayer(marker));

  circleMarkers = [];
  document.getElementById("list-container").innerHTML = "";

  const parser = new DOMParser();
  const gpxDoc = parser.parseFromString(data, "application/xml");

  gpxLayer = new L.GPX(data, {
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
        const { lat, lng, meta } = point;
        const row = createRow({ lat, lng, meta });
        container.appendChild(row);

        const circleMarker = L.circleMarker([lat, lng], {
          radius: 3,
          color: "blue",
        })
          .on("mouseover", () => circleMarker.setStyle({ radius: 6 }))
          .on("mouseout", () => {
            if (circleMarker.options.color !== selectedCircleColor) {
              circleMarker.setStyle({ radius: 3 });
            }
          })
          .on("click", (e) => {
            e.originalEvent.stopPropagation();
            resetStyles();
            setStyles({ circleMarker, row });
            row.scrollIntoView({ behavior: "smooth", block: "center" });
          })
          .addTo(map);

        circleMarkers.push({ marker: circleMarker, row });

        row.addEventListener("click", () => {
          resetStyles();
          setStyles({ circleMarker, row });
        });

        row.addEventListener("dblclick", () => {
          if (circleMarkers.length > 2) {
            gpxData = removeTrkpt({ gpxDoc, lat, lng });
            loadGPX(gpxData);
          } else {
            alert("No more deletions allowed");
          }
        });
      });
    })
    .on("loaded", (e) => map.fitBounds(e.target.getBounds()))
    .addTo(map);
}

function saveGpxFile(data) {
  // Create a Blob from the GPX data
  const blob = new Blob([data], { type: "application/gpx+xml" });

  // Create a link element
  const a = document.createElement("a");

  // Create an object URL from the Blob
  const url = URL.createObjectURL(blob);

  // Set the href attribute to the object URL
  a.href = url;

  // Set the download attribute with a default file name
  a.download = "modified_track.gpx";

  // Append the link to the body (required for Firefox)
  document.body.appendChild(a);

  // Programmatically click the link to trigger the download
  a.click();

  // Clean up by removing the link and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
  row.id = `row-${lat}-${lng}`;
  row.classList.add("row");
  return row;
};

const resetStyles = () => {
  circleMarkers.forEach(({ marker, row }) => {
    marker.setStyle({ color: "blue", radius: 3 });
    row.style.backgroundColor = "";
  });
};

const setStyles = ({ circleMarker, row }) => {
  circleMarker.setStyle({ color: selectedCircleColor, radius: 6 });
  row.style.backgroundColor = selectedRowColor;
};

const removeTrkpt = ({ gpxDoc, lat, lng }) => {
  const trkpts = gpxDoc.getElementsByTagName("trkpt");
  for (let i = 0; i < trkpts.length; i++) {
    const trkpt = trkpts[i];
    const latAttr = parseFloat(trkpt.getAttribute("lat"));
    const lonAttr = parseFloat(trkpt.getAttribute("lon"));
    if (latAttr === lat && lonAttr === lng) {
      trkpt.parentNode.removeChild(trkpt);
      break;
    }
  }

  const serializer = new XMLSerializer();
  const updatedGpxData = serializer.serializeToString(gpxDoc);
  gpxData = updatedGpxData;

  return updatedGpxData;
};
