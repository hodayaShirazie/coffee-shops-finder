# Coffee Finder

A full stack web app to find coffee shops near your location or by searching an address/city. Built with React (frontend) and Node.js/Express (backend). Integrates Google Maps for location display.

## Features
- Find coffee shops near you or by search
- Google Maps integration
- No user reviews (for now)

## Getting Started

### 1. Google Maps API Key
- Go to https://console.cloud.google.com/
- Create a new project (or use an existing one)
- Enable the Maps JavaScript API and Places API
- Create an API key and restrict it to your app
- Add the API key to your frontend code (instructions will be in the frontend code)

### 2. Install Dependencies
#### Frontend
```
npm install
```
#### Backend
```
cd backend
npm install
```

### 3. Run the App
#### Backend
```
cd backend
npm start
```
#### Frontend (in project root)
```
npm run dev
```

The frontend will run on http://localhost:5173 and the backend on http://localhost:5000 by default.

---

Replace the placeholder API key in the frontend before using Google Maps features.
