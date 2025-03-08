'use client';

import { useEffect, useRef, useState } from 'react';

// Define Google Maps types to avoid 'any' usage
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMap;
        Marker: new (options: GoogleMarkerOptions) => GoogleMarker;
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: AutocompleteOptions) => GoogleAutocomplete;
        };
      }
    };
    initMap: () => void;
  }
}

// Google Maps type definitions
interface GoogleLatLng {
  lat: number;
  lng: number;
}

interface GoogleLatLngBounds {
  extend: (latLng: GoogleLatLng) => void;
}

interface GoogleMapOptions {
  center: GoogleLatLng;
  zoom: number;
  mapTypeId?: string;
  tilt?: number;
  heading?: number;
}

interface GoogleMap {
  setCenter: (latLng: GoogleLatLng) => void;
  getCenter: () => {lat: () => number, lng: () => number};
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  fitBounds: (bounds: GoogleLatLngBounds) => void;
}

interface GoogleMarkerOptions {
  map: GoogleMap;
  position: GoogleLatLng;
  title?: string;
}

interface GoogleMarker {
  setMap: (map: GoogleMap | null) => void;
}

interface AutocompleteOptions {
  bounds?: GoogleLatLngBounds;
}

interface GoogleAutocomplete {
  bindTo: (key: string, map: GoogleMap) => void;
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => GooglePlace;
}

interface GooglePlace {
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
    viewport?: GoogleLatLngBounds;
  };
  name?: string;
}

const NEXT_GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API;

const GoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<GoogleMap | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (typeof window === 'undefined') return;

      if (window.google?.maps) {
        initializeMap();
        return;
      }

      if (document.querySelector("script[src*='maps.googleapis.com']")) {
        return; // Prevent multiple script loads
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        // Use regular Google Maps API without beta flag
        script.src = `https://maps.googleapis.com/maps/api/js?key=${NEXT_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Google Maps API failed to load.'));
        document.head.appendChild(script);

        window.initMap = () => resolve();
      });

      initializeMap();
    };

    const initializeMap = async () => {
      if (!window.google?.maps || !mapRef.current) return;

      try {
        console.log("Initializing standard Google Maps");

        // Initial position
        const initialPosition: GoogleLatLng = { lat: 9.5916, lng: 76.5222 };

        // Create a standard Google Map
        const map = new window.google.maps.Map(mapRef.current, {
          center: initialPosition,
          zoom: 15,
          mapTypeId: 'satellite',
          tilt: 45,
          heading: 0
        });

        mapInstance.current = map;

        // Set up a smooth animation to simulate the 3D effect
        const smoothPan = (map: GoogleMap, endPosition: GoogleLatLng): void => {
          const startPosition = map.getCenter();
          const startZoom = map.getZoom();
          const endZoom = 15;
          const frames = 60;
          let frame = 0;
          
          function animate() {
            if (frame < frames) {
              const progress = frame / frames;
              
              // Interpolate position
              const lat = startPosition.lat() + (endPosition.lat - startPosition.lat()) * progress;
              const lng = startPosition.lng() + (endPosition.lng - startPosition.lng()) * progress;
              map.setCenter({ lat, lng });
              
              // Interpolate zoom
              const zoom = startZoom + (endZoom - startZoom) * progress;
              map.setZoom(zoom);
              
              frame++;
              requestAnimationFrame(animate);
            }
          }
          
          animate();
        };

        // Setup place search
        if (inputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
          autocomplete.bindTo('bounds', map);
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (!place.geometry || !place.geometry.location) {
              console.log("No details available for place: " + place.name);
              return;
            }
            
            // If the place has a geometry, present it on map
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              const position: GoogleLatLng = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              
              smoothPan(map, position);
              
              // Add marker for the selected place
              new window.google.maps.Marker({
                map,
                position: position,
                title: place.name
              });
            }
          });
        }

        setMapLoaded(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    loadGoogleMaps();
  }, []);

  // Using mapLoaded state to conditionally render a loading indicator
  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="  Search for a place" 
          style={{ 
            width: '100%', 
            padding: '10px',
            borderRadius: '25px',
            border: '1px solid #ccc'
          }} 
        />
      </div>
      <div className='pb-20'
        ref={mapRef} 
        style={{ 
          width: '1000px', 
          height: '800px', 
          borderRadius: '8px',
          overflow: 'hidden' 
        }} 
      />
      {!mapLoaded && <div>Loading map...</div>}
    </div>
  );
};

export default GoogleMaps;