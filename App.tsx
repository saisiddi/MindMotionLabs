
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import { UserRole } from './types';

interface UserInfo {
  name: string;
  role: UserRole;
  id?: string;
}

export interface AppointmentRequest {
  patientName: string;
  patientId: string;
  time: string;
  status: 'pending' | 'confirmed';
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [activePatients, setActivePatients] = useState<UserInfo[]>([]);
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);

  const handleLogin = (name: string, role: UserRole, id?: string) => {
    const user = { name, role, id: id || `ID-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    setCurrentUser(user);
    if (role === 'patient') {
      setActivePatients(prev => {
        if (prev.find(p => p.name === name)) return prev;
        return [...prev, user];
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addAppointmentRequest = (request: AppointmentRequest) => {
    setAppointmentRequests(prev => [...prev, request]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onLogin={handleLogin} />
          </motion.div>
        ) : currentUser.role === 'doctor' ? (
          <motion.div
            key="doctor"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DoctorDashboard 
              userName={currentUser.name} 
              onLogout={handleLogout} 
              patients={activePatients}
              appointments={appointmentRequests}
            />
          </motion.div>
        ) : (
          <motion.div
            key="patient"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PatientDashboard 
              userName={currentUser.name} 
              onLogout={handleLogout} 
              userId={currentUser.id || ''}
              onRequestAppointment={addAppointmentRequest}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
