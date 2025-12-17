import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, KeyRound, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    homeAddress: '',
    sosPin: '',
    confirmPin: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const signupData = JSON.parse(localStorage.getItem('resqify-signup-data') || '{}');
  const layoutStyle = localStorage.getItem('resqify-layout') || 'classic';

  useEffect(() => {
    if (!signupData.name) {
      navigate('/signup');
    }
  }, [signupData, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { homeAddress, sosPin, confirmPin } = formData;

    if (!homeAddress || !sosPin || !confirmPin) {
      toast.error('Please fill in all fields');
      return;
    }

    if (sosPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    if (sosPin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    setIsLoading(true);

    const age = calculateAge(signupData.dob);
    const isMinor = age < 18;

    const userProfile = {
      name: signupData.name,
      email: signupData.email,
      dob: signupData.dob,
      homeAddress,
      sosPin,
      character: theme,
      layoutStyle: layoutStyle as 'classic' | 'minimal' | 'cards',
      isProfileComplete: true,
      isMinor,
    };

    setTimeout(() => {
      setUser(userProfile);
      localStorage.removeItem('resqify-signup-data');
      
      if (isMinor) {
        toast.info('Minor safety features activated. Add your mother as a contact for enhanced protection.');
      }
      
      toast.success('Profile setup complete!');
      navigate('/home');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8 overflow-y-auto">
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Almost Done!</h1>
          <p className="text-muted-foreground mt-2">
            Set up your safety details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <label className="text-sm font-medium text-foreground">
              Home Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <textarea
                name="homeAddress"
                value={formData.homeAddress}
                onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                placeholder="Enter your home address (used for safety check-ins)"
                rows={3}
                className="input-safety pl-12 resize-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Safety check-ins won't activate when you're home
            </p>
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <label className="text-sm font-medium text-foreground">
              SOS Cancel PIN
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                name="sosPin"
                value={formData.sosPin}
                onChange={handleChange}
                placeholder="Create a 4+ digit PIN"
                className="input-safety pl-12"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <label className="text-sm font-medium text-foreground">
              Confirm PIN
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                name="confirmPin"
                value={formData.confirmPin}
                onChange={handleChange}
                placeholder="Re-enter your PIN"
                className="input-safety pl-12"
                inputMode="numeric"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This PIN is used to cancel SOS alerts
            </p>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 animate-fade-in"
            size="lg"
            disabled={isLoading}
            style={{ animationDelay: '0.4s' }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
