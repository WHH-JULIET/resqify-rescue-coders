import { useState, useEffect, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Phone, Navigation, Filter, X, MapPin, Building2, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/PageWrapper';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type FilterType = 'police' | 'hospital' | 'safe-zones' | 'friends';

interface MarkerInfo {
  id: string;
  type: FilterType;
  name: string;
  distance: string;
  lat: number;
  lng: number;
  phone?: string;
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

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function MapPage() {
  const { contacts } = useUser();
  const { character } = useTheme();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['police', 'hospital']);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 28.6139, lng: 77.209 });
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filters: { id: FilterType; label: string; icon: typeof Building2 }[] = [
    { id: 'police', label: 'Police', icon: Shield },
    { id: 'hospital', label: 'Hospital', icon: Building2 },
    { id: 'safe-zones', label: 'Safe Zones', icon: MapPin },
    { id: 'friends', label: 'Best Friends', icon: Users },
  ];

  // Mock nearby places - in production, fetch from Places API
  const nearbyPlaces: MarkerInfo[] = useMemo(() => {
    if (!userLocation) return [];
    return [
      { id: '1', type: 'police', name: 'Central Police Station', distance: '0.8 km', lat: userLocation.lat + 0.005, lng: userLocation.lng + 0.003, phone: '112' },
      { id: '2', type: 'hospital', name: 'City Hospital', distance: '1.2 km', lat: userLocation.lat - 0.004, lng: userLocation.lng + 0.006, phone: '108' },
      { id: '3', type: 'safe-zones', name: 'Community Center', distance: '0.5 km', lat: userLocation.lat + 0.002, lng: userLocation.lng - 0.004 },
      { id: '4', type: 'police', name: 'Traffic Police', distance: '1.5 km', lat: userLocation.lat - 0.008, lng: userLocation.lng - 0.002, phone: '112' },
      { id: '5', type: 'hospital', name: 'Emergency Clinic', distance: '0.9 km', lat: userLocation.lat + 0.003, lng: userLocation.lng - 0.007, phone: '108' },
    ];
  }, [userLocation]);

  const bestFriends = contacts.filter(c => c.isBestFriend);

  const visibleMarkers = nearbyPlaces.filter(p => activeFilters.includes(p.type));

  const getMarkerColor = (type: FilterType) => {
    switch (type) {
      case 'police': return '#3B82F6';
      case 'hospital': return '#EF4444';
      case 'safe-zones': return '#22C55E';
      case 'friends': return character.color;
      default: return '#6B7280';
    }
  };

  const handleNavigate = (marker: MarkerInfo) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`, '_blank');
  };

  const handleCall = (phone?: string) => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  return (
    <PageWrapper>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Map Container */}
        <div className="relative flex-1 mx-4 mt-4 mb-2 rounded-2xl overflow-hidden shadow-card min-h-[50vh]">
          {userLocation && GOOGLE_MAPS_API_KEY ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={userLocation}
                defaultZoom={15}
                mapId="resqify-map"
                gestureHandling="greedy"
                disableDefaultUI={false}
                className="w-full h-full"
              >
                {/* User location marker */}
                <AdvancedMarker position={userLocation}>
                  <div className="relative">
                    <div 
                      className="w-6 h-6 rounded-full border-4 border-card shadow-lg animate-pulse"
                      style={{ backgroundColor: character.color }}
                    />
                    <div 
                      className="absolute inset-0 w-6 h-6 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: character.color }}
                    />
                  </div>
                </AdvancedMarker>

                {/* Place markers */}
                {visibleMarkers.map((marker) => (
                  <AdvancedMarker 
                    key={marker.id} 
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => setSelectedMarker(marker)}
                  >
                    <Pin
                      background={getMarkerColor(marker.type)}
                      borderColor="#fff"
                      glyphColor="#fff"
                    />
                  </AdvancedMarker>
                ))}

                {/* Best friend markers */}
                {activeFilters.includes('friends') && bestFriends.map((friend, idx) => (
                  <AdvancedMarker
                    key={friend.id}
                    position={{ 
                      lat: userLocation.lat + (Math.random() - 0.5) * 0.01, 
                      lng: userLocation.lng + (Math.random() - 0.5) * 0.01 
                    }}
                  >
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-card shadow-lg"
                        style={{ backgroundColor: character.color }}
                      >
                        {friend.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-safe text-safe-foreground text-[8px] px-1 rounded">
                        LIVE
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}
              </Map>
            </APIProvider>
          ) : (
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
                  
                  <div className="w-full max-w-sm space-y-2 mt-4 max-h-[30vh] overflow-y-auto">
                    {visibleMarkers.map(place => (
                      <button
                        key={place.id}
                        onClick={() => setSelectedMarker(place)}
                        className="w-full p-3 bg-card rounded-xl shadow-soft flex items-center gap-3 text-left hover:shadow-card transition-all"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${getMarkerColor(place.type)}20` }}
                        >
                          {place.type === 'police' && <Shield size={16} style={{ color: getMarkerColor(place.type) }} />}
                          {place.type === 'hospital' && <Building2 size={16} style={{ color: getMarkerColor(place.type) }} />}
                          {place.type === 'safe-zones' && <MapPin size={16} style={{ color: getMarkerColor(place.type) }} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{place.name}</p>
                          <p className="text-xs text-muted-foreground">{place.distance}</p>
                        </div>
                      </button>
                    ))}
                    
                    {activeFilters.includes('friends') && bestFriends.map(friend => (
                      <div key={friend.id} className="w-full p-3 bg-card rounded-xl shadow-soft flex items-center gap-3">
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
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Add VITE_GOOGLE_MAPS_API_KEY for full map
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-card shadow-card flex items-center justify-center z-10"
          >
            <Filter size={20} className="text-foreground" />
          </button>
        </div>

        {/* Emergency Numbers - Scrollable */}
        <div className="px-4 pb-24 flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground mb-3">Emergency Numbers</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {emergencyNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-card rounded-xl shadow-soft hover:shadow-card transition-all active:scale-95"
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
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Map Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={cn(
                      'w-full p-4 rounded-xl flex items-center gap-4 transition-all active:scale-[0.98]',
                      isActive ? 'bg-accent border-2 border-primary' : 'bg-secondary border-2 border-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isActive ? 'bg-primary' : 'bg-muted'
                    )}>
                      <Icon size={20} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                    </div>
                    <span className={cn('font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                      {filter.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="sticky bottom-0 pt-4 bg-card">
              <Button onClick={() => setShowFilters(false)} className="w-full" size="lg">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Marker Bottom Sheet */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedMarker.name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{selectedMarker.type.replace('-', ' ')}</p>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">{selectedMarker.distance} away</p>
            
            <div className="flex gap-4">
              {selectedMarker.phone && (
                <Button variant="outline" className="flex-1" onClick={() => handleCall(selectedMarker.phone)}>
                  <Phone size={18} />
                  Call
                </Button>
              )}
              <Button className="flex-1" onClick={() => handleNavigate(selectedMarker)}>
                <Navigation size={18} />
                Navigate
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
