import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import LanguageSwitcher from '../components/molecules/LanguageSwitcher';
import { HeartPulse, Phone, Lock, Sparkles, Key } from 'lucide-react';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(phone, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const fillDemo = () => {
    setPhone('9876543210');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-primary/10 border border-white">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-primary p-4 rounded-[1.5rem] text-white mb-6 shadow-lg shadow-primary/30 transform transition-transform hover:rotate-6">
              <HeartPulse size={40} />
            </div>
            <h1 className="text-4xl font-display font-bold text-[#1A2332] tracking-tight">
              Sehatsetu
            </h1>
            <p className="text-[#8A9BB0] font-medium mt-2 text-center">
              Empowering Rural Healthcare with AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={20} className="text-primary" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isRequired
              wrapperClassName="rounded-2xl"
              className="py-4 text-lg border-2 focus:border-primary"
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={20} className="text-primary" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              wrapperClassName="rounded-2xl"
              className="py-4 text-lg border-2 focus:border-primary"
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">!</div>
                <p className="text-xs text-danger font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              size="lg"
              className="w-full py-5 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20" 
              isLoading={isLoading}
            >
              Enter Dashboard
            </Button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-8 p-6 bg-primary-light/50 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Sparkles size={14} /> Quick Demo Access
            </div>
            <p className="text-[11px] text-[#4A5A72] font-medium text-center">
              Use test account to explore all features instantly.
            </p>
            <button 
              onClick={fillDemo}
              className="mt-1 flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 rounded-full text-xs font-black text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Key size={12} /> Auto-fill Demo Credentials
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-[#8A9BB0] font-medium">
              New to the community?{' '}
              <Link to="/signup" className="text-primary font-black hover:underline underline-offset-4">
                Join Now
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-10">
          <LanguageSwitcher variant="compact" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
