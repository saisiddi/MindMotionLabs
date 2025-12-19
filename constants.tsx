
import React from 'react';
import { Eye, Watch, Activity, LayoutDashboard, Users, Calendar, BarChart3, Settings } from 'lucide-react';
import { Feature } from './types';

export const COLORS = {
  primary: '#00897B',
  secondary: '#102A43',
  background: '#F8FAFC',
  alert: '#FF6B6B',
};

export const FEATURES: Feature[] = [
  {
    title: 'Computer Vision',
    description: 'Real-time posture correction using advanced AI algorithms.',
    icon: <Eye className="w-6 h-6 text-[#00897B]" />,
  },
  {
    title: 'Smart Monitoring',
    description: '24/7 Vitals tracking & seizure detection for complete safety.',
    icon: <Watch className="w-6 h-6 text-[#00897B]" />,
  },
  {
    title: 'Doctor Portal',
    description: 'Live patient data visibility with interactive progress charts.',
    icon: <Activity className="w-6 h-6 text-[#00897B]" />,
  },
];

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { label: 'Patients', icon: <Users size={20} />, id: 'patients' },
  { label: 'Appointments', icon: <Calendar size={20} />, id: 'appointments' },
  { label: 'Analytics', icon: <BarChart3 size={20} />, id: 'analytics' },
  { label: 'Settings', icon: <Settings size={20} />, id: 'settings' },
];

export const ROM_DATA = [
  { week: 'Week 1', degrees: 45 },
  { week: 'Week 2', degrees: 72 },
  { week: 'Week 3', degrees: 115 },
  { week: 'Week 4', degrees: 148 },
];

export const ACTIVITY_DATA = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 55 },
  { day: 'Fri', minutes: 40 },
  { day: 'Sat', minutes: 80 },
  { day: 'Sun', minutes: 95 },
];
