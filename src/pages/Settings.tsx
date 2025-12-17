import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Clock, LogOut, ChevronRight, Smartphone, AlertTriangle, MapPin, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { useTheme, characters } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const { theme, setTheme, character } = useTheme();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSafetySettings, setShowSafetySettings] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    homeAddress: user?.homeAddress || '',
    sosPin: '',
  });

  const [safetySettings, setSafetySettings] = useState({
    fallDetection: true,
    distressSound: true,
    lowBattery: true,
    safetyCheckIn: true,
    unsafeStartTime: '18:00',
    unsafeEndTime: '05:00',
    checkInInterval: 30,
  });

  const handleSaveProfile = () => {
    if (!profileForm.name || !profileForm.homeAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updates: any = {
      name: profileForm.name,
      homeAddress: profileForm.homeAddress,
    };

    if (profileForm.sosPin && profileForm.sosPin.length >= 4) {
      updates.sosPin = profileForm.sosPin;
    }

    updateUser(updates);
    toast.success('Profile updated');
    setShowEditProfile(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Update your name, address, PIN',
          onClick: () => {
            setProfileForm({
              name: user?.name || '',
              homeAddress: user?.homeAddress || '',
              sosPin: '',
            });
            setShowEditProfile(true);
          },
        },
        {
          icon: Palette,
          label: 'Theme',
          description: `Current: ${character.name}`,
          onClick: () => setShowThemeSettings(true),
        },
      ],
    },
    {
      title: 'Safety',
      items: [
        {
          icon: Shield,
          label: 'Auto SOS Triggers',
          description: 'Fall detection, distress sound, low battery',
          onClick: () => setShowSafetySettings(true),
        },
        {
          icon: Clock,
          label: 'Safety Check-ins',
          description: 'Periodic wellness checks',
          onClick: () => setShowSafetySettings(true),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage alert preferences',
          onClick: () => toast.info('Configure in device settings'),
        },
        {
          icon: Smartphone,
          label: 'Permissions',
          description: 'Location, camera, microphone',
          onClick: () => toast.info('Configure in device settings'),
        },
      ],
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        {/* User Card */}
        <div className="card-safety flex items-center gap-4 mb-6">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: character.color }}
          >
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-lg">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Minor Safety Alert */}
        {user.isMinor && (
          <div className="card-safety bg-warning/10 border-2 border-warning/30 flex items-center gap-4 mb-6">
            <AlertTriangle className="text-warning" size={24} />
            <div>
              <p className="font-semibold text-foreground text-sm">Minor Safety Active</p>
              <p className="text-xs text-muted-foreground">
                Enhanced protection until age 18
              </p>
            </div>
          </div>
        )}

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {section.title}
            </h2>
            <div className="card-safety p-0 overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors',
                      index !== section.items.length - 1 && 'border-b border-border'
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="input-safety"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Home Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                  <textarea
                    value={profileForm.homeAddress}
                    onChange={(e) => setProfileForm({ ...profileForm, homeAddress: e.target.value })}
                    rows={3}
                    className="input-safety pl-12 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New SOS PIN (optional)</label>
                <input
                  type="password"
                  value={profileForm.sosPin}
                  onChange={(e) => setProfileForm({ ...profileForm, sosPin: e.target.value })}
                  placeholder="Leave blank to keep current"
                  className="input-safety"
                  inputMode="numeric"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveProfile} className="w-full mt-6" size="lg">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Theme Settings Modal */}
      {showThemeSettings && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Choose Theme</h2>
              <button
                onClick={() => setShowThemeSettings(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    setTheme(char.id);
                    updateUser({ character: char.id });
                    toast.success(`Theme changed to ${char.name}`);
                  }}
                  className={cn(
                    'p-4 rounded-2xl border-2 transition-all',
                    theme === char.id
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card'
                  )}
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: char.color }}
                  />
                  <p className="font-medium text-foreground text-center text-sm">
                    {char.name}
                  </p>
                </button>
              ))}
            </div>
            
            <Button
              onClick={() => setShowThemeSettings(false)}
              className="w-full mt-6"
              size="lg"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Safety Settings Modal */}
      {showSafetySettings && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Safety Settings</h2>
              <button
                onClick={() => setShowSafetySettings(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Auto SOS Triggers</h3>
              
              {[
                { key: 'fallDetection', label: 'Fall Detection', desc: 'Detect sudden falls' },
                { key: 'distressSound', label: 'Distress Sound', desc: 'Voice detection' },
                { key: 'lowBattery', label: 'Low Battery Alert', desc: 'Alert contacts at 5%' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setSafetySettings(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev]
                    }))}
                    className={cn(
                      'w-12 h-7 rounded-full transition-colors relative',
                      safetySettings[item.key as keyof typeof safetySettings]
                        ? 'bg-primary'
                        : 'bg-muted'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform',
                        safetySettings[item.key as keyof typeof safetySettings]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              ))}

              <h3 className="font-semibold text-foreground pt-4">Safety Check-ins</h3>
              
              <div className="p-4 bg-secondary rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-foreground">Enable Check-ins</p>
                    <p className="text-xs text-muted-foreground">
                      Only when outside home during unsafe hours
                    </p>
                  </div>
                  <button
                    onClick={() => setSafetySettings(prev => ({
                      ...prev,
                      safetyCheckIn: !prev.safetyCheckIn
                    }))}
                    className={cn(
                      'w-12 h-7 rounded-full transition-colors relative',
                      safetySettings.safetyCheckIn ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform',
                        safetySettings.safetyCheckIn ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {safetySettings.safetyCheckIn && (
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Start</label>
                        <input
                          type="time"
                          value={safetySettings.unsafeStartTime}
                          onChange={(e) => setSafetySettings(prev => ({
                            ...prev,
                            unsafeStartTime: e.target.value
                          }))}
                          className="input-safety py-2"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">End</label>
                        <input
                          type="time"
                          value={safetySettings.unsafeEndTime}
                          onChange={(e) => setSafetySettings(prev => ({
                            ...prev,
                            unsafeEndTime: e.target.value
                          }))}
                          className="input-safety py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Check-in Interval</label>
                      <div className="flex gap-2 mt-2">
                        {[15, 30, 45, 60].map((min) => (
                          <button
                            key={min}
                            onClick={() => setSafetySettings(prev => ({
                              ...prev,
                              checkInInterval: min
                            }))}
                            className={cn(
                              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                              safetySettings.checkInInterval === min
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {min}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => {
                setShowSafetySettings(false);
                toast.success('Safety settings saved');
              }}
              className="w-full mt-6"
              size="lg"
            >
              Save Settings
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
