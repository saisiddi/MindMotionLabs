
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, Heart, Bell, CheckCircle2, AlertCircle, LogOut, Search, Users, 
  Calendar, BarChart3, Settings, Shield, User, MessageSquare, Mail, Phone, Lock, ChevronLeft,
  ArrowUpRight, Download, Filter, FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';
import { SIDEBAR_ITEMS } from '../constants';
import StatsCard from './StatsCard';
import { AppointmentRequest } from '../App';

interface DoctorDashboardProps {
  userName: string;
  onLogout: () => void;
  patients: { name: string; id?: string }[];
  appointments: AppointmentRequest[];
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ userName, onLogout, patients, appointments }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard label="Patient Recovery" value="78.4%" trend="+12.1%" icon={<TrendingUp size={24}/>} color="bg-teal-50 text-[#00897B]" />
        <StatsCard label="Adherence Rate" value="94%" trend="Optimal" icon={<CheckCircle2 size={24}/>} color="bg-blue-50 text-blue-600" />
        <StatsCard label="Vitals Baseline" value="Stable" icon={<Heart size={24}/>} color="bg-pink-50 text-pink-500" />
        <StatsCard label="Critical Alerts" value="0" trend="Clear" icon={<AlertCircle size={24}/>} color="bg-green-50 text-green-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px]">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <LineChartIcon size={48} className="text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-[#102A43] mb-4">Mobility Data Pending</h3>
          <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
            Detailed trajectory analytics will be available once patients begin their recorded recovery sessions.
          </p>
        </div>

        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-black text-[#102A43] mb-8">Active Patients ({patients.length})</h3>
          <div className="space-y-4">
            {patients.length > 0 ? patients.map((p, i) => (
              <div 
                key={i} 
                onClick={() => { setSelectedPatientId(p.id || null); setActiveTab('analytics'); }}
                className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:border-[#00897B] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#102A43] text-white rounded-xl flex items-center justify-center font-bold text-xs uppercase">{p.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-[#102A43] text-sm group-hover:text-[#00897B] transition-colors">{p.name}</p>
                    <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Connected</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#00897B]" />
              </div>
            )) : (
              <div className="text-center py-20">
                <Users className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">No patients connected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Patient Name</th>
            <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">System ID</th>
            <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
            <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Recovery Progress</th>
            <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.length > 0 ? patients.map((p, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-10 py-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-50 text-[#00897B] rounded-xl flex items-center justify-center font-black uppercase">{p.name.charAt(0)}</div>
                <span className="font-bold text-[#102A43] group-hover:text-[#00897B] transition-colors">{p.name}</span>
              </td>
              <td className="px-10 py-6 text-slate-500 font-mono text-xs">{p.id || 'N/A'}</td>
              <td className="px-10 py-6"><span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">Active</span></td>
              <td className="px-10 py-6"><div className="w-full h-1.5 bg-slate-100 rounded-full max-w-[100px]"><div className="h-full bg-[#00897B] rounded-full" style={{ width: '45%' }}></div></div></td>
              <td className="px-10 py-6"><button onClick={() => { setSelectedPatientId(p.id || null); setActiveTab('analytics'); }} className="text-teal-600 font-black text-xs uppercase hover:underline">View EHR</button></td>
            </tr>
          )) : (
            <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-300 font-bold">Waiting for patients to sign in...</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-[#102A43]">Upcoming Requests</h3>
          <span className="px-4 py-2 bg-teal-50 text-[#00897B] rounded-full text-xs font-black uppercase tracking-widest">{appointments.length} New</span>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.length > 0 ? appointments.map((app, i) => (
            <div key={i} className="p-10 flex items-center justify-between hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-teal-50 text-[#00897B] rounded-2xl flex items-center justify-center font-black text-xl uppercase">{app.patientName.charAt(0)}</div>
                <div>
                  <h4 className="font-bold text-lg text-[#102A43]">{app.patientName}</h4>
                  <p className="text-sm text-slate-400 flex items-center gap-2"><Calendar size={14} /> Request sent: {app.time}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-[#00897B] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00796B] transition-all">Confirm</button>
                <button className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Reschedule</button>
              </div>
            </div>
          )) : (
            <div className="py-40 text-center">
              <Calendar className="mx-auto text-slate-100 mb-6" size={80} />
              <p className="text-2xl font-black text-slate-200">No appointments found</p>
              <p className="text-slate-400 mt-2 font-medium">Pending requests will appear here once submitted by patients.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    if (selectedPatient) {
      return (
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedPatientId(null)}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#00897B] transition-colors"
            >
              <ChevronLeft size={20} /> Back to Global Analytics
            </button>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"><Download size={14}/> Export Profile</button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#102A43] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Update Care Plan</button>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-6 mb-12 pb-12 border-b border-slate-100">
              <div className="w-20 h-20 bg-teal-50 text-[#00897B] rounded-3xl flex items-center justify-center font-black text-3xl uppercase">{selectedPatient.name.charAt(0)}</div>
              <div>
                <h2 className="text-3xl font-black text-[#102A43]">{selectedPatient.name}</h2>
                <div className="flex gap-6 mt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {selectedPatient.id}</span>
                  <span className="text-xs font-bold text-[#00897B] uppercase tracking-widest">Phase 2 Recovery</span>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Awaiting Session Logs</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 min-h-[300px] text-center">
                <LineChartIcon size={40} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-black text-[#102A43] mb-2">Progress Graph Pending</h3>
                <p className="text-sm text-slate-400 font-medium">Visualization data is currently being synthesized from patient recordings.</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-[#102A43] mb-2">Cognitive Score Status</h3>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <div className="text-center py-6">
                     <p className="text-slate-400 font-bold italic">Waiting for diagnostic session completion...</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <AlertCircle className="text-blue-500" />
                  <p className="text-xs font-bold text-blue-700">Patient assigned to Recovery Phase 2. Scheduled for assessment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#102A43]">System-Wide Metrics</h2>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"><Filter size={14}/> Filter Data</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
            <FileBarChart size={64} className="text-slate-100 mb-6" />
            <h3 className="text-xl font-black text-[#102A43] mb-4">Daily Activity Insights Pending</h3>
            <p className="text-slate-400 max-w-xs font-medium">Aggregate activity data will populate once clinical sessions are initiated.</p>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
            <PieChartIcon size={64} className="text-slate-100 mb-6" />
            <h3 className="text-xl font-black text-[#102A43] mb-4">Recovery Outcomes Pending</h3>
            <p className="text-slate-400 max-w-xs font-medium">Outcome trends are waiting for sufficient longitudinal data points.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-[#102A43] mb-10">Professional Profile</h3>
        <div className="flex items-center gap-8 mb-12">
          <div className="w-24 h-24 bg-[#102A43] text-white rounded-3xl flex items-center justify-center font-black text-3xl uppercase">{userName.charAt(0)}</div>
          <div>
            <h4 className="text-2xl font-bold text-[#102A43]">{userName}</h4>
            <p className="text-slate-400 font-medium">Head of Neuro-Rehabilitation • MindMotion Health</p>
            <button className="mt-4 text-[#00897B] font-black text-xs uppercase tracking-widest hover:underline">Edit Photo</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
            <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="email" defaultValue="dr.jenkins@mindmotion.ai" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 outline-none font-bold text-slate-700" /></div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Phone</label>
            <div className="relative"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="tel" defaultValue="+1 (555) 902-1144" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 outline-none font-bold text-slate-700" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-[#102A43] mb-10">Security & Access</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-4 text-[#102A43] font-bold"><Lock size={20} className="text-slate-400" /> Two-Factor Authentication</div>
            <div className="w-12 h-6 bg-[#00897B] rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-4 text-[#102A43] font-bold"><Shield size={20} className="text-slate-400" /> Biometric Data Sharing</div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
          </div>
        </div>
        <button className="w-full mt-10 py-5 bg-[#102A43] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Update Security Policy</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <aside className="w-80 bg-[#102A43] flex flex-col h-full p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-14">
          <div className="bg-[#00897B] p-2.5 rounded-xl shadow-lg"><Activity className="text-white w-6 h-6" /></div>
          <span className="text-2xl font-black text-white tracking-tighter">MindMotion <span className="text-[#00897B] font-light">Pro</span></span>
        </div>
        <nav className="flex-1 space-y-3">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedPatientId(null); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-sm transition-all ${activeTab === item.id ? 'bg-[#00897B] text-white shadow-xl shadow-teal-900/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{item.icon} {item.label}</button>
          ))}
        </nav>
        <div className="pt-10 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center font-black text-white shadow-lg uppercase">{userName.split(' ').map(n => n[0]).join('')}</div>
            <div className="text-white"><p className="font-black text-sm truncate w-40">{userName}</p><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Medical Staff</p></div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"><LogOut size={16} /> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="p-10 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-3xl font-black text-[#102A43] tracking-tight">
              {activeTab === 'analytics' && selectedPatientId ? `Patient Deep Dive` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-sm text-slate-400 font-medium">MindMotion Central Management Console</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Global EHR Search..." className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 text-sm w-80 focus:ring-2 focus:ring-[#00897B] outline-none font-medium" /></div>
            <button className="p-3.5 rounded-2xl bg-slate-50 relative border border-slate-100"><Bell size={22} /><span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
          </div>
        </header>

        <div className="p-12 space-y-10 max-w-[1500px] mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
