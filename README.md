# Airport Radar — React

## Run locally
1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run:
   npm install
   npm run dev
4. Open the local URL Vite prints.

## Current version
This project includes an interactive Leaflet map, airport markers, searchable aircraft, flight details, arrivals/departures navigation, responsive layout, and simulated aircraft movement.

## Live data
The aircraft are intentionally simulated so the project runs immediately without an API key. To make it a real live-flight tracker, connect a licensed aviation data provider in `src/App.jsx` (or through a backend proxy) and replace the `planes0` demo data with API responses. Never put a private API secret directly in frontend code.
