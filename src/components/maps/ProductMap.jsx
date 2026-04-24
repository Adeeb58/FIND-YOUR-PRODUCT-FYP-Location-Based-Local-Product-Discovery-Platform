// src/components/maps/ProductMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import L from 'leaflet';
import { useLocation } from '../../context/LocationContext';
import { Button } from '../../components/ui/button';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [12.9716, 77.5946]; // Bangalore, India

// Component to update map center when results change
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function ProductMap({ searchResults = [], className }) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const { location } = useLocation();

  useEffect(() => {
    if (searchResults.length > 0) {
      // Create markers
      const newMarkers = searchResults.map((result) => ({
        lat: result.vendor.latitude,
        lng: result.vendor.longitude,
        id: result.vendor.id + '-' + result.product.id,
        name: result.vendor.name,
        productName: result.product.name,
        price: result.price,
        stock: result.stock,
        vendorId: result.vendor.id
      }));
      setMarkers(newMarkers);

      // Center map on first result
      setMapCenter([
        searchResults[0].vendor.latitude,
        searchResults[0].vendor.longitude
      ]);
    } else {
      setMarkers([]);
      setMapCenter(defaultCenter);
    }
  }, [searchResults]);

  const handleGetDirections = (lat, lng) => {
    if (location && location.lat && location.lng) {
      // Use OpenStreetMap OSRM route planner — 100% free, no API key needed
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.lat},${location.lng};${lat},${lng}`;
      window.open(url, '_blank');
    } else {
      // Fallback: just show the destination pin on OpenStreetMap
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`w-full rounded-xl overflow-hidden shadow-lg z-0 relative ${className || 'h-[400px]'}`}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={mapCenter} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
          >
            <Popup>
              <div className="min-w-[150px]">
                <h4 className="font-bold text-sm">{marker.productName}</h4>
                <p className="text-xs text-muted-foreground">{marker.name}</p>
                <p className="font-bold text-fypBlue mt-1">
                  {formatPrice(marker.price)}
                </p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${marker.stock === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {marker.stock}
                </span>

                <Button
                  size="sm"
                  className="w-full mt-2 h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1"
                  onClick={() => handleGetDirections(marker.lat, marker.lng)}
                >
                  <Navigation className="h-3 w-3" /> Get Directions
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
