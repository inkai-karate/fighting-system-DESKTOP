// File: src/renderer/components/Sidebar.tsx
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { Home, LogOut, Sun, Moon, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@renderer/store/configProvider'
import { useTheme } from './ThemeProvider'

const navItems = [
  { id: 'home', label: 'Home', icon: Home, link: '/' },
  { id: 'event', label: 'Event', icon: Calendar, link: '/event' }
]

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
  onLogout?: () => void
  onProfileClick?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'home', onTabChange, onLogout }) => {
  const navigate = useNavigate()
  const { setTheme, theme } = useTheme()
  const [active, setActive] = useState(activeTab)
  const { assetsPathConfig } = useConfigStore()

  const handleTabClick = (tabId: string, link: string): void => {
    setActive(tabId)
    onTabChange?.(tabId)
    navigate(link)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="flex flex-col bg-gradient-to-b from-blue-500 via-blue-600 to-cyan-500 dark:from-blue-900 dark:via-blue-950 dark:to-cyan-900 w-20 shadow-xl relative overflow-hidden"
        aria-label="Sidebar navigation"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Logo/Brand */}
          <div className="relative flex items-center justify-center h-20 pt-6 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30 dark:border-white/10">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center">
              <img src={`${assetsPathConfig}/images/logo.png`} alt="Logo" className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 relative z-10">
          <ul className="flex flex-col items-center gap-3 px-3">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = active === item.id

              return (
                <li key={index} className="w-full">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleTabClick(item.id, item.link)}
                        className={`
                          relative w-full h-14 flex flex-col items-center justify-center rounded-2xl
                          transition-all duration-300 outline-none group
                          ${
                            isActive
                              ? 'bg-white dark:bg-white/95 text-blue-600 shadow-xl scale-105'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }
                        `}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon
                          size={24}
                          strokeWidth={2}
                          className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                        />
                        <span
                          className={`text-[9px] font-medium mt-1 uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-70'}`}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="relative z-10 pb-6 px-3 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full h-14 flex items-center justify-center rounded-2xl
                  text-white/70 hover:text-white
                  hover:bg-white/10
                  transition-all duration-300 outline-none
                  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500"
              >
                {/* Sun Icon */}
                <Sun
                  className={`absolute h-5 w-5 text-white
          transition-all duration-300 transform 
          ${theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}
                />

                {/* Moon Icon */}
                <Moon
                  className={`absolute h-5 w-5 text-white
          transition-all duration-300 transform 
          ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
        `}
                />
                <span className="sr-only">Toggle theme</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Tema
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className="
                  w-full h-14 flex items-center justify-center rounded-2xl
                  text-white/70 hover:text-white
                  hover:bg-red-500/20
                  transition-all duration-300 outline-none
                  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500
                "
                aria-label="Logout"
              >
                <LogOut size={20} strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
