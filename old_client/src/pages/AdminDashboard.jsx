import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import Navbar from '../components/organisms/Navbar';
import { 
  Users, Activity, AlertCircle, TrendingUp, 
  Map as MapIcon, Calendar, Download, ShieldCheck
} from 'lucide-react';

const COLORS = ['#1A6FA3', '#1A7A4A', '#D97706', '#C0392B'];

const data = [
  { name: 'Jan', total: 400, urgent: 24 },
  { name: 'Feb', total: 520, urgent: 30 },
  { name: 'Mar', total: 480, urgent: 28 },
  { name: 'Apr', total: 610, urgent: 45 },
];

const diseaseData = [
  { name: 'Fever', value: 45 },
  { name: 'Respiratory', value: 25 },
  { name: 'Maternal', value: 15 },
  { name: 'Chronic', value: 15 },
];

const StatSummary = ({ label, value, trend, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#D4DCE8] shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-[#F4F7FB] rounded-xl text-[#1A6FA3]">
        <Icon size={20} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-[#E6F7EE] text-[#1A7A4A]' : 'bg-[#FDEDEC] text-[#C0392B]'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <p className="text-xs font-bold text-[#8A9BB0] uppercase">{label}</p>
    <p className="text-2xl font-bold text-[#1A2332]">{value}</p>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-[#1A2332]">System Analytics</h2>
            <p className="text-[#8A9BB0]">Monitoring health trends across rural districts.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4DCE8] rounded-lg text-sm font-bold text-[#4A5A72] hover:bg-gray-50 shadow-sm">
            <Download size={18} /> Export Reports
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatSummary label="Total Patients" value="12,482" trend={12} icon={Users} />
          <StatSummary label="Active Consults" value="842" trend={8} icon={Activity} />
          <StatSummary label="Emergency Alerts" value="43" trend={-5} icon={AlertCircle} />
          <StatSummary label="Uptime Health" value="99.9%" trend={0} icon={ShieldCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Consultation Trends */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#D4DCE8] shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-[#1A2332] mb-6">Consultation Volume (Last 4 Months)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A6FA3" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A6FA3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8A9BB0', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8A9BB0', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#1A6FA3" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Distribution */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#D4DCE8] shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-[#1A2332] mb-6">Common Ailments</h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={diseaseData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-2 justify-center">
              {diseaseData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                  <span className="text-[10px] font-bold text-[#4A5A72] uppercase">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* District Performance */}
          <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-[#D4DCE8] shadow-sm mb-8">
            <h3 className="text-lg font-bold text-[#1A2332] mb-6">District Health Density</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Rampur', 'Sitapur', 'Madipur', 'Bhopalpur'].map(d => (
                <div key={d} className="p-4 bg-[#F4F7FB] rounded-xl flex justify-between items-center group hover:bg-[#EBF4FF] transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-[#1A2332]">{d}</p>
                    <p className="text-xs text-[#8A9BB0]">1,200+ Active Patients</p>
                  </div>
                  <TrendingUp size={18} className="text-[#1A7A4A] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
