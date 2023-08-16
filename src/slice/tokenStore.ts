import { create } from 'zustand'

interface TokenState {
  accessToken: string
  setAccessToken: (newToken: string) => void
}

export const useTokenSlice = create<TokenState>()((set) => ({
  accessToken: '',
  setAccessToken: (newToken: string) => set(() => ({ accessToken: newToken })),
}))
