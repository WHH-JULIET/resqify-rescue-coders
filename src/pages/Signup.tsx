import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import logo from '@/assets/logo.jpeg';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, dob, password, confirmPassword } = formData;

    if (!name || !email || !dob || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      // Store basic info to complete profile setup
      localStorage.setItem('resqify-signup-data', JSON.stringify({
        name,
        email,
        dob,
      }));
      toast.success('Account created! Complete your profile setup.');
      navigate('/setup/character');
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSignup = () => {
    toast.info('Google Sign-In requires native Android setup');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <img
            src={logo}
            alt="ResQify"
            className="w-16 h-16 rounded-xl shadow-card object-cover mb-3"
          />
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join ResQify for your safety</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="input-safety pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email or phone number"
                className="input-safety pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input-safety pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="input-safety pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="input-safety pl-12"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Signup */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignup}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        {/* Login Link */}
        <p className="text-center mt-6 text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
