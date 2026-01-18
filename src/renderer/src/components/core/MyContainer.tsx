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
        'bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 rounded-lg shadow transition-colors duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}
