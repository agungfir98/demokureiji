import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}
export const MainHeading: React.FC<Props> = ({ children }) => {
  return <h1 className="font-semibold text-xl">{children}</h1>
}
