"use client";

import { View } from "@/lib/data";
import { create } from "zustand";

interface UiState {
  loading: boolean;
  sideMenuOpen: boolean;

  view: View;

  setView: (view: View) => void;

  toogleSideMenu: () => void;
  startLoading: () => void;
  endLoading: () => void;
}

export const UiStore = create<UiState>()((set) => ({
  loading: false,
  sideMenuOpen: false,

  view: "home",
  setView(view) {
    set((s) => ({ ...s, view }));
  },

  toogleSideMenu() {
    set((s) => ({ ...s, sideMenuOpen: !s.sideMenuOpen }));
  },
  startLoading() {
    set((s) => ({ ...s, loading: true }));
  },
  endLoading() {
    set((s) => ({ ...s, loading: false }));
  },
}));
