import React, { ReactNode } from 'react'
import Spinner from '@/components/spinner'

const LoadingScreen: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center outline-black outline-2">
        <Spinner className="h-8" />
        {children}
      </div>
    </div>
  )
}

export default LoadingScreen
