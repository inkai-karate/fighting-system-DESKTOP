import React, { useState } from 'react'
import { X, User, Copy } from 'lucide-react'
import { UseGlobalLayout } from './hook/useGlobalLayout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'

interface TitleBarProps {
  title?: string
  username?: string
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
}

export const LoginTitleBar: React.FC<TitleBarProps> = ({ username = '' }) => {
  const { deviceId, showModal, setShowModal } = UseGlobalLayout()

  // === State Modal Close Confirm ===
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  // === Trigger open dialog, tidak langsung close ===
  const handleCloseClick = (): void => {
    setShowConfirmClose(true)
  }

  // === Confirm action ===
  const confirmClose = (): void => {
    localStorage.clear()
    window.electron?.ipcRenderer.send('window-close')
  }

  return (
    <div
      className="h-10 bg-slate-100 flex items-center justify-between px-3 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left - App Icon & Title */}
      <div className="flex items-center gap-2">
        {/* <div className="w-4 h-4 rounded flex items-center justify-center">
          <img src={`${assetsPathConfig}/images/logo.png`} alt="" />
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{title}</span> */}
      </div>

      {/* Center - Username */}
      {username !== '' && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{username}</span>
        </div>
      )}

      {/* Right Controls */}
      <div
        className="flex items-center gap-0.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Divider */}
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />

        {/* Close */}
        <button
          onClick={handleCloseClick}
          className="h-8 w-9 flex items-center justify-center hover:bg-red-500 transition-colors rounded group"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white" />
        </button>
      </div>

      {/* DEVICE ID MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Device ID</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="w-full">
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                <span className="text-[16px] font-mono break-all text-gray-700 dark:text-gray-300">
                  {deviceId || 'Loading...'}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 ml-2"
                  onClick={() => navigator.clipboard.writeText(deviceId || '')}
                >
                  <Copy className="text-[7px]" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM CLOSE MODAL */}
      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Keluar Aplikasi</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            Apakah Anda yakin ingin keluar dari aplikasi?
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
              Batal
            </Button>

            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmClose}>
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
