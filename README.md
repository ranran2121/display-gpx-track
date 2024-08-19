# Display GPX Track

A simple web application that displays GPS tracks from GPX files on a Leaflet map. This project utilizes Leaflet for mapping and the `leaflet-gpx` plugin to render GPX data.

## Features

- **GPX File Loading**: Load GPX files and visualize tracks on the map.
- **Dynamic Markers**: Display markers for each point in the GPX file.
- **Interactive List**: A list of points on the left side, which updates based on the GPX data.
- **Highlighting**: Click on a marker to highlight the corresponding row in the list, or click on a row to highlight the corresponding marker on the map.
- **Custom Styling**: Different colors and styles for start and end points.

## Technologies Used

- [Leaflet](https://leafletjs.com/): A leading open-source JavaScript library for interactive maps.
- [Leaflet-GPX](https://github.com/mpetazzoni/leaflet-gpx): A plugin to load and display GPX files on Leaflet maps.
- HTML5 and JavaScript

## Installation

### Prerequisites

Make sure you have a modern web browser and an internet connection to load libraries from CDNs.

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/display-gpx-track.git
   cd display-gpx-track
   ```

2. **Open the HTML File**

Simply open the index.html file in your web browser. The project uses CDNs for dependencies, so no local server setup is required.

### Usage

1. **Load a GPX File**

Click the "Choose File" button to select a GPX file from your local file system. The map will update to display the track data from the GPX file.

2. **Interact with the Map**

Click on Markers: Click on any marker on the map to see its details and highlight the corresponding row in the list.
Click on List Rows: Click on any row in the list to highlight the corresponding marker on the map.

3. **Highlighting Points**

Start Point: Marked in green.
End Point: Marked in red.

### File Structure

index.html: The main HTML file that includes Leaflet and leaflet-gpx libraries.
styles.css: Custom styles for the application.
script.js: JavaScript code for handling map interactions and GPX data.

### Contributing

Feel free to fork the repository and submit pull requests. For major changes or enhancements, please open an issue to discuss your ideas.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments

Leaflet for the mapping library.
Leaflet-GPX for the GPX plugin.
