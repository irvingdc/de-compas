import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapPickerProps {
    onLocationSelected: (location: { lat: number; lng: number; address?: string }) => void;
}

// Memoize these static objects outside the component to prevent recreating them
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

const defaultCenter = {
    lat: 19.4326, // Mexico City coordinates as default
    lng: -99.1332
};

const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string | undefined> => {
    try {
        const geocoder = new google.maps.Geocoder();
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode(
                { location: { lat, lng } },
                (results, status) => {
                    if (status === 'OK' && results) {
                        resolve(results);
                    } else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                }
            );
        });
        return result[0]?.formatted_address;
    } catch (error) {
        console.error('Error getting address:', error);
        return undefined;
    }
};

const MapPicker: React.FC<MapPickerProps> = React.memo(({ onLocationSelected }) => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Set loading state and initial location without address
            setIsLoading(true);
            setSelectedLocation({ lat, lng });

            try {
                // Get address from coordinates
                const address = await getAddressFromCoordinates(lat, lng);

                // Update location with address
                setSelectedLocation({ lat, lng, address });

                // Call the callback with the location data
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

    // Memoize the map center to prevent unnecessary recalculations
    const mapCenter = useMemo(() => selectedLocation || defaultCenter, [selectedLocation]);

    // Memoize the map zoom to prevent unnecessary recalculations
    const mapZoom = useMemo(() => selectedLocation ? 15 : 10, [selectedLocation]);

    return (
        <div className="w-full">

            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={mapZoom}
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
                    Obteniendo detalles de la ubicación...
                </div>
            )}

            {selectedLocation && !isLoading && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Ubicación seleccionada:</strong>
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Latitud: {selectedLocation.lat.toFixed(6)}, Longitud: {selectedLocation.lng.toFixed(6)}
                    </p>
                    {selectedLocation.address && (
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            Dirección: {selectedLocation.address}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

MapPicker.displayName = 'MapPicker';

export default MapPicker;
