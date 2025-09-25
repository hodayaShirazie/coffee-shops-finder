import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  const [location, setLocation] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Load Google Maps script
  useEffect(() => {
    if (window.google) return;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {};
    document.body.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // Default: New York
        zoom: 13,
      });
    }
  }, [window.google, mapRef.current]);

  // Helper: Clear markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // Search for coffee shops
  const searchCoffeeShops = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMarkers();
    let geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        mapInstance.current.setCenter(loc);
        const service = new window.google.maps.places.PlacesService(mapInstance.current);
        service.nearbySearch(
          {
            location: loc,
            radius: 2000,
            type: ['cafe'],
            keyword: 'coffee',
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setShops(results);
              results.forEach(place => {
                const marker = new window.google.maps.Marker({
                  map: mapInstance.current,
                  position: place.geometry.location,
                  title: place.name,
                });
                markersRef.current.push(marker);
              });
            } else {
              setShops([]);
            }
            setLoading(false);
          }
        );
      } else {
        setShops([]);
        setLoading(false);
        alert('Location not found.');
      }
    });
  };

  // Use current location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        mapInstance.current.setCenter(loc);
        const service = new window.google.maps.places.PlacesService(mapInstance.current);
        clearMarkers();
        service.nearbySearch(
          {
            location: loc,
            radius: 2000,
            type: ['cafe'],
            keyword: 'coffee',
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setShops(results);
              results.forEach(place => {
                const marker = new window.google.maps.Marker({
                  map: mapInstance.current,
                  position: place.geometry.location,
                  title: place.name,
                });
                markersRef.current.push(marker);
              });
            } else {
              setShops([]);
            }
            setLoading(false);
          }
        );
      },
      () => {
        setLoading(false);
        alert('Could not get your location.');
      }
    );
  };

  return (
    <div className="App">
      <h1>Coffee Finder</h1>
      <form onSubmit={searchCoffeeShops} style={{marginBottom: '1em'}}>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Enter city or address"
          style={{width: '250px', marginRight: '0.5em'}}
        />
        <button type="submit" disabled={loading}>Search</button>
        <button type="button" onClick={useCurrentLocation} disabled={loading} style={{marginLeft: '0.5em'}}>
          Use My Location
        </button>
      </form>
      <div id="map" ref={mapRef} style={{ width: '100%', height: '400px', marginBottom: '1em' }}></div>
      {loading && <p>Loading...</p>}
      <ul>
        {shops.map(shop => (
          <li key={shop.place_id}>
            <b>{shop.name}</b><br/>
            {shop.vicinity}
          </li>
        ))}
      </ul>
      <p style={{color:'gray', fontSize:'0.9em', marginTop:'1em'}}>To enable Google Maps, add your API key in <code>src/App.jsx</code> where it says <b>YOUR_GOOGLE_MAPS_API_KEY</b>.</p>
    </div>
  );
}

export default App;
