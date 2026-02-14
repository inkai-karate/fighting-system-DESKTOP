import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Check, Building2, MapPin, Phone } from 'lucide-react'
import type { IBranch } from '@interface/branch.interface'
import { cn } from '@renderer/lib/utils'

interface ModalBranchSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branches: IBranch[]
  onBranchSelect: (branch: IBranch) => void
}

export const ModalBranchSelector: React.FC<ModalBranchSelectorProps> = ({
  open,
  onOpenChange,
  branches,
  onBranchSelect
}) => {
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(() => {
    // Initialize from localStorage
    const savedBranch = localStorage.getItem('selectedBranch')
    if (savedBranch) {
      try {
        return JSON.parse(savedBranch)
      } catch (error) {
        console.error('Error parsing saved branch:', error)
      }
    }
    return branches.length > 0 ? branches[0] : null
  })

  useEffect(() => {
    // Update if branches change and no selection
    if (!selectedBranch && branches.length > 0) {
      const defaultBranch = branches[0]
      localStorage.setItem('selectedBranch', JSON.stringify(defaultBranch))
      localStorage.setItem('selectedBranchUuid', defaultBranch.uuid)
    }
  }, [branches, selectedBranch])

  const handleSelectBranch = (branch: IBranch): void => {
    setSelectedBranch(branch)
    localStorage.setItem('selectedBranch', JSON.stringify(branch))
    localStorage.setItem('selectedBranchUuid', branch.uuid)
    onBranchSelect(branch)
    onOpenChange(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Pilih Outlet/Cabang
          </DialogTitle>
          <DialogDescription>
            Pilih outlet atau cabang yang ingin Anda akses. Data yang ditampilkan akan disesuaikan
            dengan cabang yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          {branches.length > 0 ? (
            <div className="space-y-2">
              {branches.map((branch) => (
                <button
                  key={branch.uuid}
                  onClick={() => handleSelectBranch(branch)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                    selectedBranch?.uuid === branch.uuid
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {branch.branch_name}
                        </h3>
                      </div>

                      {branch.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{branch.address}</span>
                        </div>
                      )}

                      {branch.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                    </div>

                    {selectedBranch?.uuid === branch.uuid && (
                      <div className="ml-3 shrink-0">
                        <div className="rounded-full bg-blue-600 p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Tidak ada cabang tersedia</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Hubungi administrator untuk mendapatkan akses cabang
              </p>
            </div>
          )}
        </ScrollArea>

        {selectedBranch && branches.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Cabang Aktif:</strong> {selectedBranch.branch_name}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
