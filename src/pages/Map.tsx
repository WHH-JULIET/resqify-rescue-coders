import { useState, useEffect } from 'react';
import { Phone, Navigation, Filter, X, MapPin, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

type FilterType = 'police' | 'hospital' | 'safe-zones' | 'friends';

interface MarkerInfo {
  id: string;
  type: FilterType;
  name: string;
  distance: string;
  lat: number;
  lng: number;
}

const emergencyNumbers = [
  { name: 'Police', number: '112', icon: '🚓' },
  { name: 'Ambulance', number: '108', icon: '🚑' },
  { name: 'Fire', number: '101', icon: '🚒' },
  { name: 'Women Helpline', number: '181', icon: '👩' },
  { name: 'Women Safety', number: '1091', icon: '🆘' },
  { name: 'Child Helpline', number: '1098', icon: '👶' },
  { name: 'Mental Health', number: '14416', icon: '🧠' },
];

export default function MapPage() {
  const { contacts } = useUser();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['police', 'hospital']);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Default to a location if geolocation fails
          setUserLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  }, []);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filters: { id: FilterType; label: string; icon: typeof Building2 }[] = [
    { id: 'police', label: 'Police', icon: Shield },
    { id: 'hospital', label: 'Hospital', icon: Building2 },
    { id: 'safe-zones', label: 'Safe Zones', icon: MapPin },
    { id: 'friends', label: 'Best Friends', icon: MapPin },
  ];

  // Mock nearby places
  const nearbyPlaces: MarkerInfo[] = [
    { id: '1', type: 'police', name: 'Central Police Station', distance: '0.8 km', lat: 28.615, lng: 77.211 },
    { id: '2', type: 'hospital', name: 'City Hospital', distance: '1.2 km', lat: 28.612, lng: 77.207 },
    { id: '3', type: 'safe-zones', name: 'Community Center', distance: '0.5 km', lat: 28.614, lng: 77.208 },
  ];

  const bestFriends = contacts.filter(c => c.isBestFriend);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Container */}
      <div className="relative flex-1 mx-4 mt-4 mb-2 rounded-2xl overflow-hidden shadow-card">
        {/* Map Placeholder - In production, integrate Google Maps SDK */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-secondary">
          {userLocation ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse">
                <MapPin className="text-primary" size={32} />
              </div>
              <p className="text-foreground font-semibold mb-1">Your Location</p>
              <p className="text-muted-foreground text-sm mb-4">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
              
              {/* Mock markers display */}
              <div className="w-full max-w-sm space-y-2 mt-4">
                {nearbyPlaces
                  .filter(p => activeFilters.includes(p.type))
                  .map(place => (
                    <button
                      key={place.id}
                      onClick={() => setSelectedMarker(place)}
                      className="w-full p-3 bg-card rounded-xl shadow-soft flex items-center gap-3 text-left hover:shadow-card transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        {place.type === 'police' && <Shield size={16} className="text-primary" />}
                        {place.type === 'hospital' && <Building2 size={16} className="text-primary" />}
                        {place.type === 'safe-zones' && <MapPin size={16} className="text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{place.name}</p>
                        <p className="text-xs text-muted-foreground">{place.distance}</p>
                      </div>
                    </button>
                  ))}
                
                {activeFilters.includes('friends') && bestFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="w-full p-3 bg-card rounded-xl shadow-soft flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-safe flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{friend.name}</p>
                      <p className="text-xs text-safe">Live location active</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                Add Google Maps API key for full map integration
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(true)}
          className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-card shadow-card flex items-center justify-center"
        >
          <Filter size={20} className="text-foreground" />
        </button>
      </div>

      {/* Emergency Numbers */}
      <div className="px-4 pb-20">
        <h2 className="text-lg font-semibold text-foreground mb-3">Emergency Numbers</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {emergencyNumbers.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-card rounded-xl shadow-soft hover:shadow-card transition-all"
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-xs text-muted-foreground">{item.name}</p>
                <p className="font-bold text-primary text-sm">{item.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Map Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={cn(
                      'w-full p-4 rounded-xl flex items-center gap-4 transition-all',
                      isActive ? 'bg-accent border-2 border-primary' : 'bg-secondary border-2 border-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isActive ? 'bg-primary' : 'bg-muted'
                    )}>
                      <Icon size={20} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                    </div>
                    <span className={cn(
                      'font-medium',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {filter.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <Button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6"
              size="lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{selectedMarker.name}</h2>
              <button
                onClick={() => setSelectedMarker(null)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">{selectedMarker.distance} away</p>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedMarker(null)}
              >
                <Phone size={18} />
                Call
              </Button>
              <Button className="flex-1">
                <Navigation size={18} />
                Navigate
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
