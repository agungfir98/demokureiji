'use client'
import LoadingScreen from '@/components/loadingScreen'
import { api } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { isLoading, error } = useQuery({
    queryFn: () => api.post('/refresh_token'),
    queryKey: ['access-token'],
    onSuccess() {
      router.push('/')
    },
    refetchOnWindowFocus: false,
    retry(_, error: AxiosError) {
      return error.response?.status !== 401
    },
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error?.response?.status === 401) {
    return (
      <div className="min-h-screen overflow-auto mx-auto md:flex justify-center items-center font-inter bg-gradient-to-tr from-sky-900 via-sky-700 to-fuchsia-600">
        <div className="container h-screen py-10 items-center flex justify-center">
          {children}
        </div>
      </div>
    )
  }
}

export default AuthLayout
