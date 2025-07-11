import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapPickerProps {
  onLocationSelected: (location: { lat: number; lng: number; address?: string }) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelected }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default center (you can adjust this to your preferred default location)
  const defaultCenter = {
    lat: 19.4326, // Mexico City coordinates as default
    lng: -99.1332
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedLocation({ lat, lng });
      setIsLoading(true);

      try {
        // Reverse geocoding to get address
        const geocoder = new google.maps.Geocoder();
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === 'OK' && results) {
                resolve(results);
              } else {
                reject(new Error('Geocoding failed'));
              }
            }
          );
        });

        const address = result[0]?.formatted_address || 'Address not found';
        onLocationSelected({ lat, lng, address });
      } catch (error) {
        console.error('Error getting address:', error);
        onLocationSelected({ lat, lng });
      } finally {
        setIsLoading(false);
      }
    }
  }, [onLocationSelected]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    // You can add any map initialization logic here
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Select Location
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click on the map to select a location
        </p>
      </div>

              <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
        >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={selectedLocation || defaultCenter}
          zoom={selectedLocation ? 15 : 10}
          options={mapOptions}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              animation={google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {isLoading && (
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          Getting location details...
        </div>
      )}

      {selectedLocation && !isLoading && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Selected Location:</strong>
          </p>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
