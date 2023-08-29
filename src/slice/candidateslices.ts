import { CandidateType } from '@/types/vote-event-type'
import { create } from 'zustand'

interface StateType {
  setCandidate: (data: CandidateType) => void
  candidate: CandidateType
}

export const useCandidateSlice = create<StateType>()((set) => ({
  candidate: {
    avatar: { url: undefined },
    calonKetua: '',
    calonWakil: '',
    description: '',
  },
  setCandidate(data) {
    set(() => ({ candidate: data }))
  },
}))
