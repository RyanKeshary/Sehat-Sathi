import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import LanguageSwitcher from '../components/molecules/LanguageSwitcher';
import { HeartPulse, User, Phone, Lock, MapPin, Sparkles } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    village: '',
    role: 'patient'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col relative overflow-hidden py-12 px-4 md:py-20">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-success/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-primary/10 border border-white relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary p-4 rounded-[1.5rem] text-white mb-6 shadow-lg shadow-primary/30 transform transition-transform hover:-rotate-6">
            <HeartPulse size={36} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light rounded-full text-primary text-[10px] font-black mb-4 uppercase tracking-widest">
            <Sparkles size={12} />
            <span>Digital Health Passport</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A2332]">
            Join Sehatsetu
          </h1>
          <p className="text-[#8A9BB0] font-medium mt-2 text-center">
            Start your journey towards a healthier life today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            placeholder="Rahul Kumar"
            leftIcon={<User size={18} className="text-primary" />}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            isRequired
            wrapperClassName="rounded-2xl"
            className="py-4 border-2 focus:border-primary"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={18} className="text-primary" />}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              isRequired
              wrapperClassName="rounded-2xl"
              className="py-4 border-2 focus:border-primary"
            />

            <Input
              label="Village / Town"
              placeholder="Rampur"
              leftIcon={<MapPin size={18} className="text-primary" />}
              value={formData.village}
              onChange={(e) => setFormData({...formData, village: e.target.value})}
              isRequired
              wrapperClassName="rounded-2xl"
              className="py-4 border-2 focus:border-primary"
            />
          </div>

          <Input
            label="Create Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} className="text-primary" />}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            isRequired
            hint="Min 8 characters"
            wrapperClassName="rounded-2xl"
            className="py-4 border-2 focus:border-primary"
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg"
              className="w-full py-5 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20" 
              isLoading={isLoading}
            >
              Confirm Registration
            </Button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-[#8A9BB0] font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-10 flex justify-center scale-90 opacity-80">
        <LanguageSwitcher variant="compact" />
      </div>
    </div>
  );
};

export default SignupPage;
