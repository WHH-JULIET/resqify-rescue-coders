import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Clock, LogOut, ChevronRight, AlertTriangle, MapPin, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/PageWrapper';
import { useUser } from '@/contexts/UserContext';
import { useTheme, characters } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const { theme, setTheme, character } = useTheme();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAutoSOS, setShowAutoSOS] = useState(false);
  const [showCheckIns, setShowCheckIns] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    homeAddress: user?.homeAddress || '',
    sosPin: '',
  });

  const [autoSOSSettings, setAutoSOSSettings] = useState({
    fallDetection: true,
    distressSound: true,
    lowBattery: true,
  });

  const [checkInSettings, setCheckInSettings] = useState({
    enabled: true,
    unsafeStartTime: '18:00',
    unsafeEndTime: '05:00',
    interval: 30,
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

  if (!user) return null;

  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-5 pt-6">
          {/* Header */}
          <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

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
                <p className="text-xs text-muted-foreground">Enhanced protection until age 18</p>
              </div>
            </div>
          )}

          {/* Account Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Account
            </h2>
            <div className="card-safety p-0 overflow-hidden">
              <button
                onClick={() => {
                  setProfileForm({
                    name: user?.name || '',
                    homeAddress: user?.homeAddress || '',
                    sosPin: '',
                  });
                  setShowEditProfile(true);
                }}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors border-b border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Edit Profile</p>
                  <p className="text-xs text-muted-foreground">Name, address, PIN</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
              
              <button
                onClick={() => setShowThemeSettings(true)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Palette size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">Current: {character.name}</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Safety Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Safety Features
            </h2>
            <div className="card-safety p-0 overflow-hidden">
              <button
                onClick={() => setShowAutoSOS(true)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors border-b border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Shield size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Auto SOS Triggers</p>
                  <p className="text-xs text-muted-foreground">Fall detection, distress sound</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
              
              <button
                onClick={() => setShowCheckIns(true)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Clock size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Safety Check-ins</p>
                  <p className="text-xs text-muted-foreground">Periodic wellness checks</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* App Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              App
            </h2>
            <div className="card-safety p-0 overflow-hidden">
              <button
                onClick={() => toast.info('Configure notifications in device settings')}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Bell size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Manage alert preferences</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>

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
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
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
            
            <div className="p-6 pt-4 border-t border-border bg-card safe-bottom">
              <Button onClick={handleSaveProfile} className="w-full" size="lg">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings Modal */}
      {showThemeSettings && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Choose Theme</h2>
              <button onClick={() => setShowThemeSettings(false)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4">
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
                      'p-4 rounded-2xl border-2 transition-all active:scale-95',
                      theme === char.id ? 'border-primary bg-accent' : 'border-border bg-card'
                    )}
                  >
                    <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: char.color }} />
                    <p className="font-medium text-foreground text-center text-sm">{char.name}</p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 pt-4 border-t border-border bg-card safe-bottom">
              <Button onClick={() => setShowThemeSettings(false)} className="w-full" size="lg">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auto SOS Modal */}
      {showAutoSOS && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Auto SOS Triggers</h2>
              <button onClick={() => setShowAutoSOS(false)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-3">
              {[
                { key: 'fallDetection', label: 'Fall Detection', desc: 'Detect sudden falls and trigger alert' },
                { key: 'distressSound', label: 'Distress Sound', desc: 'Voice-activated emergency detection' },
                { key: 'lowBattery', label: 'Low Battery Alert', desc: 'Alert contacts when battery reaches 5%' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setAutoSOSSettings(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev]
                    }))}
                    className={cn(
                      'w-12 h-7 rounded-full transition-colors relative',
                      autoSOSSettings[item.key as keyof typeof autoSOSSettings] ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform',
                      autoSOSSettings[item.key as keyof typeof autoSOSSettings] ? 'translate-x-6' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-6 pt-4 border-t border-border bg-card safe-bottom">
              <Button onClick={() => { setShowAutoSOS(false); toast.success('Settings saved'); }} className="w-full" size="lg">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Check-ins Modal */}
      {showCheckIns && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Safety Check-ins</h2>
              <button onClick={() => setShowCheckIns(false)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Enable Check-ins</p>
                  <p className="text-xs text-muted-foreground">Only when outside home during unsafe hours</p>
                </div>
                <button
                  onClick={() => setCheckInSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={cn(
                    'w-12 h-7 rounded-full transition-colors relative',
                    checkInSettings.enabled ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <div className={cn(
                    'absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform',
                    checkInSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                  )} />
                </button>
              </div>

              {checkInSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Unsafe Hours</label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Start</label>
                        <input
                          type="time"
                          value={checkInSettings.unsafeStartTime}
                          onChange={(e) => setCheckInSettings(prev => ({ ...prev, unsafeStartTime: e.target.value }))}
                          className="input-safety py-2"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">End</label>
                        <input
                          type="time"
                          value={checkInSettings.unsafeEndTime}
                          onChange={(e) => setCheckInSettings(prev => ({ ...prev, unsafeEndTime: e.target.value }))}
                          className="input-safety py-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Check-in Interval</label>
                    <div className="flex gap-2">
                      {[15, 30, 45, 60].map((min) => (
                        <button
                          key={min}
                          onClick={() => setCheckInSettings(prev => ({ ...prev, interval: min }))}
                          className={cn(
                            'flex-1 py-3 rounded-xl text-sm font-medium transition-colors',
                            checkInSettings.interval === min
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground'
                          )}
                        >
                          {min}m
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 pt-4 border-t border-border bg-card safe-bottom">
              <Button onClick={() => { setShowCheckIns(false); toast.success('Settings saved'); }} className="w-full" size="lg">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
