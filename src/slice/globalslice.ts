import { create } from 'zustand'

interface NavType {
  navCollapsed: boolean
  toggleNavCollapsed: (arg: boolean) => void
}

interface GlobalStateType {
  showMemberModal: boolean
  toggleMemberModal: (arg: boolean) => void
  showNewEventModal: boolean
  toggleNewEventModal: (arg: boolean) => void
  showCandidateModal: boolean
  toggleCandidateModal: (arag: boolean) => void
  userIsAdmin: boolean
  setUserIsAdmin: (arg: boolean) => void
}

export const useNavSlice = create<NavType>()((set) => ({
  navCollapsed: false,
  toggleNavCollapsed: () =>
    set((state) => ({ navCollapsed: !state.navCollapsed })),
}))

export const useGlobalStateSlice = create<GlobalStateType>()((set) => ({
  showMemberModal: false,
  toggleMemberModal(arg) {
    set(() => ({ showMemberModal: arg }))
  },
  showNewEventModal: false,
  toggleNewEventModal(arg) {
    set(() => ({ showNewEventModal: arg }))
  },
  showCandidateModal: false,
  toggleCandidateModal(arg) {
    set(() => ({ showCandidateModal: arg }))
  },
  userIsAdmin: false,
  setUserIsAdmin(arg) {
    set(() => ({ userIsAdmin: arg }))
  },
}))
