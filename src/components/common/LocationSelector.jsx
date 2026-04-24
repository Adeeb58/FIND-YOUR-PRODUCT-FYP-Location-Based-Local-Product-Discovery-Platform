import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useLocation } from '../../context/LocationContext';

const POPULAR_CITIES = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Indore',
    'Kochi',
    'Surat',
    'Nagpur'
];

export const LocationSelector = ({ isOpen, onClose }) => {
    const { updateLocation, location, weather } = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCities = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectCity = (city) => {
        updateLocation(city);
        onClose();
    };

    const handleDetectLocation = () => {
        // Reloading page triggers the location check in context again
        // In a real app, we might expose a 'detectLocation' method from context
        window.location.reload();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border border-border shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Select Location</span>
                        {weather && (
                            <span className="text-sm font-normal text-muted-foreground flex items-center gap-1 border-l pl-2 ml-2">
                                {weather.emoji} {weather.temp}°C
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for your city"
                            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Detect Location Button */}
                    <Button
                        variant="outline"
                        className="w-full justify-start text-primary gap-2"
                        onClick={handleDetectLocation}
                    >
                        <MapPin className="h-4 w-4" />
                        Detect my location
                    </Button>

                    {/* Popular Cities */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Popular Cities
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            {filteredCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleSelectCity(city)}
                                    className={`text-sm py-2 px-3 rounded-md text-center transition-colors truncate
                    ${location.city === city
                                            ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                                            : 'bg-accent/5 hover:bg-accent/20 text-foreground border border-transparent'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                            {filteredCities.length === 0 && (
                                <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">
                                    No cities found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
