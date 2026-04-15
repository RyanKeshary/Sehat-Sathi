import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/organisms/Navbar';
import BottomNav from '../components/organisms/BottomNav';
import Button from '../components/atoms/Button';
import SOSButton from '../components/atoms/SOSButton';
import { 
  Stethoscope, FileText, Pill, Activity, 
  MapPin, Clock, ArrowRight, Video, Sparkles
} from 'lucide-react';

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group p-2 min-w-[80px]"
  >
    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-lg group-hover:shadow-xl ${color}`}>
      <Icon size={30} className="text-white" />
    </div>
    <span className="text-xs font-bold text-[#4A5A72] text-center w-20 group-hover:text-primary transition-colors">
      {label}
    </span>
  </button>
);

const AppointmentCard = ({ doctor, time, specialty, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-2xl border border-[#D4DCE8] flex items-center gap-4 shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
      <Video size={24} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-[#1A2332]">{doctor}</h4>
      <p className="text-xs text-[#8A9BB0] font-medium">{specialty} • {time}</p>
    </div>
    <ArrowRight size={18} className="text-[#D4DCE8] group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </div>
);

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 md:pb-12">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Hero Section */}
        <section 
          className="mb-10 min-h-[320px] p-8 md:p-16 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-center"
          style={{ background: 'linear-gradient(135deg, #1A6FA3 0%, #14557b 100%)' }}
        >
          <div className="relative z-10 w-full md:w-[60%] lg:w-[50%]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-bold mb-6 border border-white/20 uppercase tracking-widest">
              <Sparkles size={12} className="text-yellow-300" />
              <span>AI-Powered Health Companion</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-[1.1] tracking-tight">
              Namaste, <span className="text-blue-200">{user?.name || 'Friend'}!</span>
            </h2>
            <p className="text-blue-50/90 text-sm md:text-lg mb-10 max-w-sm font-medium leading-relaxed">
              Experience world-class healthcare in your language. Share symptoms or talk to our doctors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="white" 
                size="lg"
                onClick={() => navigate('/symptom-checker')}
                className="text-primary font-black px-10 shadow-xl"
              >
                Check Symptoms
              </Button>
              <Button 
                variant="primary" 
                size="lg"
                className="bg-[#1A7A4A] hover:bg-[#125c38] border-none px-10 font-black shadow-xl"
                onClick={() => navigate('/consultation')}
              >
                Book Doctor
              </Button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 skew-x-[-20deg] translate-x-[20%] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Hero Illustration */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:block animate-float">
             <div className="w-56 h-56 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 flex items-center justify-center rotate-6 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem]" />
                <Stethoscope size={90} className="text-white/30" />
             </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Actions & Vitals */}
          <div className="lg:col-span-8">
            {/* Quick Actions Grid */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1A2332]">Quick Services</h3>
                <button className="text-sm font-bold text-primary hover:underline">View All</button>
              </div>
              <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
                <QuickAction 
                  icon={Stethoscope} 
                  label="Find Doctor" 
                  color="bg-blue-500" 
                  onClick={() => navigate('/consultation')}
                />
                <QuickAction 
                  icon={FileText} 
                  label="My Records" 
                  color="bg-green-500" 
                  onClick={() => navigate('/records')}
                />
                <QuickAction 
                  icon={Pill} 
                  label="Pharmacy" 
                  color="bg-orange-500" 
                  onClick={() => navigate('/consultation')} // Placeholder
                />
                <QuickAction 
                  icon={Activity} 
                  label="Lab Tests" 
                  color="bg-red-500" 
                  onClick={() => navigate('/consultation')} // Placeholder
                />
                <QuickAction 
                  icon={Clock} 
                  label="Vaccination" 
                  color="bg-cyan-500" 
                  onClick={() => navigate('/consultation')} // Placeholder
                />
                <QuickAction 
                  icon={MapPin} 
                  label="Nearby" 
                  color="bg-indigo-500" 
                  onClick={() => navigate('/consultation')} // Placeholder
                />
              </div>
            </div>

            {/* Health Stats */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#1A2332] mb-6">Daily Vitals</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                   { label: 'Weight', value: '68 kg', trend: 'stable', color: 'text-blue-600' },
                   { label: 'Blood Pressure', value: '120/80', trend: 'good', color: 'text-green-600' },
                   { label: 'Blood Sugar', value: '98 mg/dL', trend: 'good', color: 'text-orange-600' },
                   { label: 'Pulse', value: '72 bpm', trend: 'stable', color: 'text-red-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-[#D4DCE8] shadow-sm hover:shadow-md transition-shadow group">
                    <p className="text-xs font-bold text-[#8A9BB0] mb-2 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <div className="mt-2 text-[10px] font-bold py-1 px-2 bg-gray-50 rounded-full inline-block group-hover:bg-primary-light group-hover:text-primary transition-colors">
                      {stat.trend === 'good' ? '↑ Ideal' : '↔ Consistent'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Schedule & Reminders */}
          <div className="lg:col-span-4">
            {/* Upcoming Appointments */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1A2332]">Upcoming</h3>
                <button className="text-sm font-bold text-primary hover:underline">Manage</button>
              </div>
              <div className="space-y-4">
                <AppointmentCard 
                  doctor="Dr. Sameer Verma" 
                  specialty="General Physician" 
                  time="Today, 04:30 PM" 
                  onClick={() => navigate('/consultation')}
                />
                <AppointmentCard 
                  doctor="Dr. Anjali Rao" 
                  specialty="Gynecologist" 
                  time="Tomorrow, 10:00 AM" 
                  onClick={() => navigate('/consultation')}
                />
              </div>
            </div>

            {/* Daily Reminders */}
            <div className="bg-gradient-to-br from-success-light to-white p-8 rounded-[2rem] border border-success-light relative overflow-hidden shadow-sm shadow-success/10">
              <div className="relative z-10">
                <h3 className="text-success font-bold text-lg mb-4 flex items-center gap-2">
                   <Pill size={20} /> Medicine Reminder
                </h3>
                <p className="text-sm text-[#4A5A72] mb-6 leading-relaxed">
                  Time for your <b>Metformin 500mg</b>. Take one tablet with your evening meal.
                </p>
                <Button 
                  size="md" 
                  variant="primary" 
                  className="bg-success hover:bg-success-dark border-none w-full"
                  onClick={() => alert("Reminder marked as completed!")}
                >
                  I've Taken it
                </Button>
              </div>
              <div className="absolute -bottom-4 -right-4 text-success/5 rotate-12">
                <Pill size={120} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <SOSButton />
    </div>
  );
};

export default PatientDashboard;
