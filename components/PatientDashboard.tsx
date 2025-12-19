
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Circle, Video, MessageSquare, Calendar, LogOut, Award,
  Smile, Meh, Frown, Send, Sparkles, X, Camera, RefreshCw, Clock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppointmentRequest } from '../App';

interface PatientDashboardProps {
  userName: string;
  onLogout: () => void;
  userId: string;
  onRequestAppointment: (req: AppointmentRequest) => void;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
  time: string;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ userName, onLogout, userId, onRequestAppointment }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Upper Limb Rotation', completed: false, time: '10 mins' },
    { id: 2, text: 'Cognitive Game: Match-3', completed: false, time: '15 mins' },
    { id: 3, text: 'Guided Meditation', completed: false, time: '5 mins' },
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: `Welcome back, ${userName}! I'm MindBot. How is your recovery journey going today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const startCamera = async (taskId: number) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setActiveTaskId(taskId);
      setSessionProgress(0);

      const interval = setInterval(() => {
        setSessionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please allow camera access to use AI Lens.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
    setSessionProgress(0);
    setActiveTaskId(null);
  };

  const completeSession = () => {
    if (activeTaskId) {
      setTasks(tasks.map(t => t.id === activeTaskId ? { ...t, completed: true } : t));
    }
    stopCamera();
  };

  const handleRequestAppointment = () => {
    setIsRequesting(true);
    setTimeout(() => {
      onRequestAppointment({
        patientName: userName,
        patientId: userId,
        time: new Date().toLocaleString(),
        status: 'pending'
      });
      setIsRequesting(false);
      alert("Appointment request sent to your doctor!");
    }, 800);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are MindBot, a supportive AI assistant for a neuro-rehabilitation patient named ${userName}. Keep responses warm, encouraging, and short.`,
        }
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm with you on every step of this journey!" }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Keep moving forward, you're doing great!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative font-sans">
      <aside className="hidden md:flex w-72 bg-[#102A43] flex-col h-screen sticky top-0 p-8 shadow-2xl">
        <div className="bg-[#00897B] p-3 rounded-2xl w-fit mb-12 shadow-lg">
          <Award className="text-white w-8 h-8" />
        </div>
        <nav className="flex-1 space-y-4">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 text-white font-semibold">
            <Calendar size={22} /> My Schedule
          </button>
          <button onClick={() => { const t = tasks.find(x=>!x.completed); if(t) startCamera(t.id); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-white/5 transition-all">
            <Video size={22} /> AI Lens
          </button>
          <button onClick={() => setIsChatOpen(true)} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-white/5 transition-all">
            <MessageSquare size={22} /> Chat Assistant
          </button>
          <button onClick={handleRequestAppointment} disabled={isRequesting} className="w-full flex items-center gap-4 p-4 rounded-2xl text-teal-400 hover:bg-teal-500/10 transition-all">
            <Clock size={22} /> {isRequesting ? 'Sending...' : 'Book Visit'}
          </button>
        </nav>
        <button onClick={onLogout} className="flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold">
          <LogOut size={22} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-black text-[#102A43] mb-3 tracking-tight leading-tight">
              Let's reach your goals, <span className="text-[#00897B]">{userName.split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">Daily consistency is key to neuro-plasticity.</p>
          </header>

          <div className="grid lg:grid-cols-2 gap-10">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold text-[#102A43]">Today's Routine</h3>
                <span className="text-sm font-black text-[#00897B] bg-teal-50 px-4 py-2 rounded-full">{progress}% Complete</span>
              </div>
              <div className="space-y-4 flex-1">
                {tasks.map((task) => (
                  <div key={task.id} className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${task.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-200 hover:border-[#00897B] shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      {task.completed ? <CheckCircle2 className="text-[#00897B]" size={28} /> : <Circle className="text-slate-200" size={28} />}
                      <div>
                        <span className={`text-lg font-bold block ${task.completed ? 'line-through text-slate-300' : 'text-[#102A43]'}`}>{task.text}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase">{task.time}</span>
                      </div>
                    </div>
                    {!task.completed && (
                      <button onClick={() => startCamera(task.id)} className="p-3 bg-teal-50 text-[#00897B] rounded-2xl hover:bg-[#00897B] hover:text-white transition-all">
                        <Camera size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-8">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-[#102A43] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-black mb-6 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span> Intelligent Pose Tracking
                  </div>
                  <h3 className="text-3xl font-black mb-4">Start AI Recovery</h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Use the AI Lens to record your sessions. Correct posture speeds up recovery and prevents injury.</p>
                  <button onClick={() => { const t = tasks.find(x=>!x.completed); if(t) startCamera(t.id); }} className="w-full flex items-center justify-center gap-3 py-5 bg-[#00897B] rounded-2xl font-black hover:bg-[#00796B] transition-all shadow-xl shadow-teal-900/40">
                    <Video size={20} /> Open Recovery Lens
                  </button>
                </div>
              </motion.div>
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                <h3 className="text-lg font-bold text-[#102A43] mb-8 uppercase tracking-widest">Wellness Check</h3>
                <div className="flex justify-around">
                  {[Frown, Meh, Smile].map((Icon, idx) => (
                    <button key={idx} className="group flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#00897B] group-hover:text-white transition-all shadow-sm">
                        <Icon size={32} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-12">
            <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute inset-0 pointer-events-none border-[20px] border-teal-500/20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-teal-400/50 rounded-full animate-pulse" />
              </div>
              <div className="absolute bottom-10 inset-x-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={stopCamera} className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all"><X size={28} /></button>
                  <div className="text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recording</p>
                    <p className="text-xl font-black">{tasks.find(t => t.id === activeTaskId)?.text}</p>
                  </div>
                </div>
                <div className="flex-1 mx-10"><div className="h-4 bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-teal-500" initial={{ width: 0 }} animate={{ width: `${sessionProgress}%` }} /></div></div>
                {sessionProgress >= 100 ? (
                  <button onClick={completeSession} className="px-10 py-5 bg-[#00897B] text-white rounded-[2rem] font-black text-lg hover:bg-[#00796B] transition-all shadow-2xl shadow-teal-500/50">Finish Session <Award size={20} /></button>
                ) : (
                  <div className="flex items-center gap-3 px-10 py-5 bg-white/10 text-white rounded-[2rem] font-black"><RefreshCw className="animate-spin" size={20} /> Processing...</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.9 }} className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-white rounded-[2.5rem] shadow-2xl z-[80] flex flex-col border border-slate-200 overflow-hidden">
            <div className="p-8 bg-[#102A43] text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500 rounded-2xl shadow-lg"><Sparkles size={20} /></div>
                <div><h4 className="font-black text-lg">MindBot</h4><p className="text-[10px] text-teal-400 uppercase font-black tracking-widest">Recovery Assistant</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4 min-h-[350px]">
              {messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-[#00897B] text-white shadow-lg' : 'bg-slate-50 text-slate-700'}`}>{m.text}</div></div>))}
              {isTyping && <div className="text-slate-300 text-xs font-black animate-pulse uppercase tracking-widest px-2">Thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-8 bg-white border-t border-slate-100 flex gap-3">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Message MindBot..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00897B]" />
              <button onClick={handleSendMessage} className="p-4 bg-[#00897B] text-white rounded-2xl hover:bg-[#00796B] transition-transform active:scale-95 shadow-lg shadow-teal-500/20"><Send size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-[#00897B] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[70]"><Sparkles size={28} /></button>
      )}
    </div>
  );
};

export default PatientDashboard;
