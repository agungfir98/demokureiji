import React, { ReactNode } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

const LoadingScreen: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center outline-black outline-2">
        <LoadingOutlined className="h-10" />
        {children}
      </div>
    </div>
  )
}

export default LoadingScreen
