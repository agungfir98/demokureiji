import { create } from 'zustand'

interface NavType {
  navCollapsed: boolean
  toggleNavCollapsed: (arg: boolean) => void
}
export const useNavSlice = create<NavType>()((set) => ({
  navCollapsed: false,
  toggleNavCollapsed: () =>
    set((state) => ({ navCollapsed: !state.navCollapsed })),
}))
