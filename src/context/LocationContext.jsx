import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        city: 'Bangalore', // Default/Fallback
        address: null,
        lat: null,
        lng: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);

    // Helper to get weather emoji
    const getWeatherEmoji = (code) => {
        if (code === undefined || code === null) return '🌡️';
        if (code === 0) return '☀️'; // Clear sky
        if (code === 1 || code === 2 || code === 3) return '⛅'; // Partly cloudy
        if (code >= 45 && code <= 48) return '🌫️'; // Fog
        if (code >= 51 && code <= 67) return '🌧️'; // Drizzle/Rain
        if (code >= 71 && code <= 77) return '❄️'; // Snow
        if (code >= 80 && code <= 82) return 'Showers'; // Rain showers
        if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
        return '🌥️';
    };

    const fetchWeather = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
            );

            if (!response.ok) throw new Error('Weather data fetch failed');

            const data = await response.json();
            setWeather({
                temp: data.current_weather.temperature,
                emoji: getWeatherEmoji(data.current_weather.weathercode),
                code: data.current_weather.weathercode
            });
        } catch (err) {
            console.error("Weather fetch error:", err);
        }
    };

    const updateLocation = async (newCity) => {
        // Optimistic update
        setLocation(prev => ({
            ...prev,
            city: newCity
        }));

        // Try to get coords for weather
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newCity)}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);

                setLocation({
                    city: newCity,
                    address: null,
                    lat: latitude,
                    lng: longitude
                });
                fetchWeather(latitude, longitude);
            }
        } catch (e) {
            console.error("Failed to update location coords:", e);
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Fetch Weather
                fetchWeather(latitude, longitude);

                try {
                    // Use OpenStreetMap Nominatim for reverse geocoding
                    // Note: This might be blocked by CORS on localhost sometimes
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch location data');
                    }

                    const data = await response.json();

                    // Extract city/town/village - Improved logic
                    const address = data.address;
                    const city = address.city ||
                        address.town ||
                        address.village ||
                        address.suburb ||
                        address.county ||
                        address.state_district ||
                        address.state ||
                        'Unknown Location';

                    setLocation({
                        city,
                        address,
                        lat: latitude,
                        lng: longitude,
                    });
                    setLoading(false);
                } catch (err) {
                    console.error("Reverse geocoding error:", err);
                    setError('Failed to fetch location name');
                    setLoading(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError('Location access denied');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }, []);

    return (
        <LocationContext.Provider value={{ location, weather, updateLocation, loading, error }}>
            {children}
        </LocationContext.Provider>
    );
};
