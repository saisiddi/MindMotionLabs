
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, User, ShieldCheck, X, Lock } from 'lucide-react';
import { FEATURES } from '../constants';
import { UserRole } from '../types';

interface LandingPageProps {
  onLogin: (name: string, role: UserRole, id?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [loginRole, setLoginRole] = useState<UserRole>('none');
  const [formData, setFormData] = useState({ name: '', id: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      onLogin(formData.name, loginRole, formData.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#00897B] p-2 rounded-xl shadow-lg shadow-teal-500/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-[#102A43] tracking-tight">MindMotion</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLoginRole('patient')} className="text-slate-600 font-bold hover:text-[#00897B] transition-colors flex items-center gap-2">
              <User size={18} /> Patient Portal
            </button>
            <button onClick={() => setLoginRole('doctor')} className="px-6 py-3 bg-[#102A43] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
              <ShieldCheck size={18} /> Doctor Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with reduced bottom padding */}
      <section className="pt-48 pb-16 px-8 overflow-hidden relative flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-7xl md:text-9xl font-black text-[#102A43] leading-[1.0] mb-10 tracking-tighter">
              Precision for <br/><span className="text-[#00897B]">Recovery.</span>
            </h1>
            <p className="text-2xl text-slate-500 mb-12 max-w-2xl leading-relaxed font-medium">
              Revolutionizing neuro-rehabilitation with AI-driven motion tracking and seamless clinical connectivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <button onClick={() => setLoginRole('patient')} className="px-12 py-6 bg-[#00897B] text-white rounded-[2.5rem] font-black text-xl hover:bg-[#00796B] transition-all transform hover:scale-105 shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3">
                Patient Access <ArrowRight />
              </button>
              <button onClick={() => setLoginRole('doctor')} className="px-12 py-6 bg-white text-[#102A43] border-2 border-slate-200 rounded-[2.5rem] font-black text-xl hover:border-[#102A43] transition-all">
                Doctor Portal
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10 opacity-40"></div>
      </section>

      {/* Login Modal Overlay */}
      <AnimatePresence>
        {loginRole !== 'none' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setLoginRole('none')}
              className="absolute inset-0 bg-[#102A43]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${loginRole === 'doctor' ? 'bg-[#102A43]' : 'bg-[#00897B]'} text-white`}>
                      {loginRole === 'doctor' ? <ShieldCheck /> : <User />}
                    </div>
                    <h2 className="text-2xl font-black text-[#102A43]">
                      {loginRole === 'doctor' ? 'Doctor Login' : 'Patient Login'}
                    </h2>
                  </div>
                  <button onClick={() => setLoginRole('none')} className="text-slate-400 hover:text-slate-600"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      placeholder={loginRole === 'doctor' ? 'e.g. Dr. Sarah Jenkins' : 'e.g. Robert Smith'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#00897B]"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                      {loginRole === 'doctor' ? 'Medical ID' : 'Recovery Code'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-[#00897B]"
                        onChange={(e) => setFormData({...formData, id: e.target.value})}
                      />
                    </div>
                  </div>
                  <button type="submit" className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl ${loginRole === 'doctor' ? 'bg-[#102A43] hover:bg-slate-800' : 'bg-[#00897B] hover:bg-[#00796B]'}`}>
                    Secure Login
                  </button>
                </form>
                
                <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
                  Enter your credentials to access your secure portal. Your data is protected with enterprise-grade encryption.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Features/Flashcards Section with reduced top padding */}
      <section className="py-20 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8">{f.icon}</div>
              <h3 className="text-2xl font-bold text-[#102A43] mb-4">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
