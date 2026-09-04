"use client"

import { create } from "zustand"
import type { College } from "@/data/colleges"
import { colleges } from "@/data/colleges"

interface CompareStore {
  collegeIds: string[]
  addCollege: (id: string) => void
  removeCollege: (id: string) => void
  clearAll: () => void
  isInCompare: (id: string) => boolean
  getColleges: () => College[]
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  collegeIds: [],
  addCollege: (id) => {
    const current = get().collegeIds
    if (current.length >= 3) return
    if (current.includes(id)) return
    set({ collegeIds: [...current, id] })
  },
  removeCollege: (id) => {
    set({ collegeIds: get().collegeIds.filter((c) => c !== id) })
  },
  clearAll: () => set({ collegeIds: [] }),
  isInCompare: (id) => get().collegeIds.includes(id),
  getColleges: () => {
    return get()
      .collegeIds.map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean) as College[]
  },
}))
