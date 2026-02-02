import React, { type ReactNode } from 'react'
import clsx from 'clsx'

interface MyContainerProps {
  children: ReactNode
  className?: string
}

export const MyContainer: React.FC<MyContainerProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        '"px-5 lg:px-10 h-[calc(100vh-40px)] flex flex-col overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}
