import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CharacterTheme } from './ThemeContext';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isBestFriend: boolean;
  permissions: {
    notifications: boolean;
    calls: boolean;
    liveLocation: boolean;
    audio: boolean;
    video: boolean;
  };
}

export interface SOSEvent {
  id: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'cancelled';
  location?: { lat: number; lng: number };
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  dob: string;
  homeAddress: string;
  sosPin: string;
  character: CharacterTheme;
  layoutStyle: 'classic' | 'minimal' | 'cards';
  isProfileComplete: boolean;
  isMinor: boolean;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  sosEvents: SOSEvent[];
  addSOSEvent: (event: Omit<SOSEvent, 'id'>) => void;
  updateSOSEvent: (id: string, updates: Partial<SOSEvent>) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('resqify-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [contacts, setContactsState] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('resqify-contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [sosEvents, setSOSEvents] = useState<SOSEvent[]>(() => {
    const saved = localStorage.getItem('resqify-sos-events');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('resqify-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('resqify-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('resqify-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('resqify-sos-events', JSON.stringify(sosEvents));
  }, [sosEvents]);

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUserState(prev => prev ? { ...prev, ...updates } : null);
  };

  const setContacts = (newContacts: Contact[]) => {
    setContactsState(newContacts);
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
    };
    setContactsState(prev => [...prev, newContact]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContactsState(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const removeContact = (id: string) => {
    setContactsState(prev => prev.filter(c => c.id !== id));
  };

  const addSOSEvent = (event: Omit<SOSEvent, 'id'>) => {
    const newEvent: SOSEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setSOSEvents(prev => [newEvent, ...prev]);
  };

  const updateSOSEvent = (id: string, updates: Partial<SOSEvent>) => {
    setSOSEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('resqify-user');
    localStorage.removeItem('resqify-theme');
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        contacts,
        setContacts,
        addContact,
        updateContact,
        removeContact,
        sosEvents,
        addSOSEvent,
        updateSOSEvent,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
