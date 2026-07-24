"use client";

import { User } from "firebase/auth";
import { create } from "zustand";

type UserProfile = {
  bio: string;
  country: string;
  createdAt: string;
  department: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  id: string;
  institution: string;
  isActive: boolean;
  lastLoginAt: string | Date;
  phoneNumber: string;
  photoURL: string;
  providerData: string;
  role: string;
  updatedAt: string | Date;
};

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLogedIn: boolean;

  setUser: (user: User | null) => void;
  setUserProfile: (userProfile: UserProfile | null) => void;
}

export const AuthStore = create<AuthState>()((set) => ({
  isLogedIn: false,
  user: null,
  userProfile: null,
  setUser(user: User | null) {
    if (user) {
      set((s) => ({ ...s, isLogedIn: true, user }));
    } else {
      set((s) => ({ ...s, isLogedIn: false, user }));
    }
  },
  setUserProfile(userProfile: UserProfile | null) {
    set((s) => ({ ...s, userProfile }));
  },
}));
