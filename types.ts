
import React from 'react';

export type UserRole = 'none' | 'doctor' | 'patient';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  time: string;
}

export interface Alert {
  id: string;
  type: 'danger' | 'info' | 'success';
  message: string;
  time: string;
  tag: string;
}
