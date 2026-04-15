import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import { 
  Users, Calendar, Clock, DollarSign, 
  FileText, CheckCircle, ArrowRight, User, Activity,
  Sparkles, MessageSquare, Video, Phone, Mic
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-[#D4DCE8] shadow-sm flex items-center gap-6 hover:shadow-lg transition-all duration-500 group cursor-default">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 ${color}`}>
      <Icon size={30} />
    </div>
    <div>
      <p className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-display font-bold text-[#1A2332]">{value}</p>
    </div>
  </div>
);

const PatientQueueItem = ({ name, time, type, urgency, onStart }) => (
  <div className="bg-white p-5 rounded-[2rem] border border-[#D4DCE8] flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary hover:shadow-xl hover:shadow-primary-light transition-all duration-500 cursor-pointer group">
    <div className="flex items-center gap-5 w-full md:w-auto">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-display font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
          {name[0]}
        </div>
        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-4 border-white ${urgency === 'high' ? 'bg-danger' : 'bg-success'}`} />
      </div>
      <div>
        <h4 className="text-lg font-bold text-[#1A2332] group-hover:text-primary transition-colors">{name}</h4>
        <div className="flex items-center gap-2 text-xs font-bold text-[#8A9BB0] uppercase tracking-tighter">
          {type === 'Video Call' ? <Video size={14} className="text-primary" /> : type === 'Audio' ? <Phone size={14} className="text-success" /> : <MessageSquare size={14} className="text-orange-400" />}
          <span>{type} • {time}</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-3 w-full md:w-auto">
      {urgency === 'high' && (
        <span className="bg-red-50 text-danger text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse border border-red-100">
          Priority
        </span>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        className="font-bold text-primary hover:bg-primary-light px-4"
        onClick={(e) => {
          e.stopPropagation();
          alert(`Opening medical records for ${name}`);
        }}
      >
        Records
      </Button>
      <Button 
        size="md" 
        className="px-8 font-black uppercase tracking-widest shadow-md shadow-primary/20"
        onClick={(e) => {
          e.stopPropagation();
          onStart();
        }}
      >
        Start
      </Button>
    </div>
  </div>
);

const QuickLink = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-6 rounded-[2rem] bg-gray-50 hover:bg-white border-2 border-transparent hover:border-primary-light transition-all duration-300 group shadow-sm hover:shadow-lg"
  >
    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary mb-3 shadow-md group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
      <Icon size={24} />
    </div>
    <span className="text-[10px] font-black text-[#4A5A72] uppercase tracking-widest text-center group-hover:text-primary">{label}</span>
  </button>
);

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const startConsultation = (patientName) => {
    alert(`Connecting to ${patientName}...`);
    // In a real app, this would navigate to a WebRTC call room
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-12">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light rounded-full text-primary text-[10px] font-bold mb-4 uppercase tracking-widest border border-primary-light">
              <Sparkles size={12} />
              <span>Verified Practitioner Dashboard</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-[#1A2332]">
              Namaste, Dr. {user?.name?.split(' ')[1] || 'Vaidya'}
            </h2>
            <p className="text-[#8A9BB0] font-medium mt-1">You have 4 patients in your pending queue for this session.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="bg-white border border-[#D4DCE8]" onClick={() => alert("Calendar syncing...")}>
              <Calendar size={18} className="mr-2" /> Schedule
            </Button>
            <Button className="bg-[#1A7A4A] hover:bg-[#156a3f]" onClick={() => alert("Setting profile to available...")}>
              Available Now
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard icon={Users} label="Total Managed" value="1,248" color="bg-blue-600" />
          <StatCard icon={Clock} label="Waiting Now" value="4" color="bg-orange-500" />
          <StatCard icon={CheckCircle} label="Today's Done" value="8" color="bg-green-600" />
          <StatCard icon={DollarSign} label="Monthly Earning" value="₹ 4.8k" color="bg-indigo-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Active Queue Control */}
          <div className="lg:col-span-8">
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-[#1A2332]">Live Patient Queue</h3>
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                  <button className="px-5 py-1.5 rounded-lg text-xs font-bold bg-white shadow-sm text-primary">Active</button>
                  <button className="px-5 py-1.5 rounded-lg text-xs font-bold text-[#8A9BB0] hover:text-[#4A5A72]">History</button>
                </div>
              </div>
              <div className="space-y-6">
                <PatientQueueItem 
                  name="Amit Sharma" 
                  time="10:30 AM" 
                  type="Video Call" 
                  urgency="high" 
                  onStart={() => startConsultation('Amit Sharma')}
                />
                <PatientQueueItem 
                  name="Sunita Devi" 
                  time="11:00 AM" 
                  type="Chat" 
                  urgency="low" 
                  onStart={() => startConsultation('Sunita Devi')}
                />
                <PatientQueueItem 
                  name="Rajesh Kumar" 
                  time="11:30 AM" 
                  type="Audio" 
                  urgency="medium" 
                  onStart={() => startConsultation('Rajesh Kumar')}
                />
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-[#D4DCE8] shadow-sm">
              <h3 className="text-xl font-bold text-[#1A2332] mb-8">Clinical Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <QuickLink icon={FileText} label="Templates" onClick={() => alert("Loading prescription templates...")} />
                <QuickLink icon={Users} label="Patients" onClick={() => alert("Opening patient directory...")} />
                <QuickLink icon={Activity} label="Analytics" onClick={() => alert("Loading practice analytics...")} />
                <QuickLink icon={Mic} label="Voice Notes" onClick={() => alert("Voice transcription active...")} />
              </div>
            </div>
          </div>

          {/* Right Panel - Contextual AI Insights */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-gradient-to-br from-[#1A2332] to-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-8">
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-400" /> Regional Insights
                </h3>
                <div className="space-y-6">
                  <div className="p-5 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Activity size={12} /> Disease Alert
                    </p>
                    <p className="text-sm leading-relaxed text-blue-50 font-medium">
                      High fever cases are rising in **Rampur** area. Consider screening for Seasonal Fever or Malaria.
                    </p>
                  </div>
                  <div className="p-5 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <CheckCircle size={12} /> Quality Tip
                    </p>
                    <p className="text-sm leading-relaxed text-green-50 font-medium">
                      Patients in your region prefer audio consultations during mornings when internet bandwidth fluctuates.
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-[#D4DCE8] shadow-sm">
              <h3 className="text-xl font-bold text-[#1A2332] mb-6">Recent Scribbles</h3>
              <div className="space-y-4">
                {[
                  { date: '14 APR', text: 'Follow up with Sunita for BP meds' },
                  { date: '13 APR', text: 'Prescribed Malaria kit for Rajesh' },
                  { date: '12 APR', text: 'Check lab results for Amit' }
                ].map((note, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                    <div className="min-w-[48px] text-[10px] font-black text-[#8A9BB0] mt-1 uppercase tracking-tighter">{note.date}</div>
                    <p className="text-xs text-[#4A5A72] font-medium leading-tight group-hover:text-primary transition-colors">{note.text}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary font-bold hover:bg-primary-light" onClick={() => alert("Showing all session notes...")}>View All Notes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
