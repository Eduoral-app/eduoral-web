"use client";

import { Resource, View } from "@/lib/data";
import { create } from "zustand";

interface BrowseState {
  resource: Resource | null;

  setResource: (resource: Resource | undefined) => void;
}

export const BrowseStore = create<BrowseState>()((set) => ({
  resource: null,
  setResource(resource) {
    set((s) => ({ ...s, resource }));
  },
}));
