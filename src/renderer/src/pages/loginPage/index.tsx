import React, { useState } from 'react'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { CircleQuestionMark, Eye, EyeOff, Lock, User } from 'lucide-react'
import logo from '@public/assets/images/logo.png'
import { useIndex } from './hook/useIndex'
import { companyName } from '@renderer/utils/config'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@renderer/components/ui/dialog'

export const LoginPage: React.FC = () => {
  const {
    formLogin,
    handleChange,
    handleLogin,
    loading,
    errorFormLogin,
    registered,
    showModal,
    setShowModal,
    submitDevice,
    company,
    setCompany,
    deviceId,
    deviceName,
    isSubmitting,
    isExpired
  } = useIndex()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full h-full flex items-center justify-center p-0 pt-0">
      <Card className="border-0 shadow-none bg-transparant w-full mx-3 rounded-xl pt-0">
        <CardHeader className="space-y-1 text-center pb-2 px-6">
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-[22px] font-bold text-gray-600 dark:text-gray-300">
            {companyName}
          </CardTitle>
          <CardDescription className="text-md dark:text-slate-400">
            {registered
              ? isExpired
                ? 'Silahkan melakukan langganan terlebih dahulu pada device ini melalui admin sistem'
                : 'Silahkan masukan nisn dan password anda untuk masuk'
              : 'Daftar device ini terlebih dahulu ke sistem'}
          </CardDescription>
        </CardHeader>
        {registered ? (
          isExpired ? (
            ''
          ) : (
            // <div className="p-5">
            //   <Button
            //     onClick={() => setShowModal(true)}
            //     className="w-full h-9 mt-1 py-6 px-2 text-[13px] bg-green-600 text-white hover:bg-green-700 hover:text-white"
            //     variant="outline"
            //   >
            //     Langgagan Sekarang
            //   </Button>
            // </div>
            <CardContent className="pb-4 px-6 pt-0">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-[16px] text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      disabled={loading.submit}
                      className="h-[45px] pl-8 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                      value={formLogin.username}
                      onChange={handleChange}
                    />
                  </div>
                  {errorFormLogin.username && (
                    <p className="text-xs text-red-500 mt-0.5">{errorFormLogin.username}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-[16px] text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      disabled={loading.submit}
                      className="h-[45px] pl-8 pr-8 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                      value={formLogin.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  {errorFormLogin.password && (
                    <p className="text-xs text-red-500 mt-0.5">{errorFormLogin.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-9 mt-1 text-sm font-medium"
                  disabled={loading.submit}
                >
                  {loading.submit ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </form>
            </CardContent>
          )
        ) : (
          <div className="p-5">
            <Button
              onClick={() => setShowModal(true)}
              className="w-full h-9 mt-1 py-6 px-2 text-[13px] bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              variant="outline"
            >
              DAFTARKAN DEVICE
            </Button>
          </div>
        )}
      </Card>

      {/* DEVICE REGISTER MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Daftarkan Device</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={submitDevice}>
            {/* Company */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Company</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">
                    <CircleQuestionMark size="52px" />{' '}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Silahkan lihat di CMS admin, Pengaturan{'>'}Informasi</p>
                </TooltipContent>
              </Tooltip>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Nama perusahaan"
              />
            </div>

            {/* Device ID (Disabled) */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Device ID</label>
              <input
                type="text"
                value={deviceId || ''}
                disabled
                className="w-full h-9 px-3 rounded-md border text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Nama Device</label>
              <input
                type="text"
                value={deviceName || ''}
                disabled
                className="w-full h-9 px-3 rounded-md border text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>

              <Button
                type="submit"
                disabled={
                  deviceName.length < 1 || deviceId.length < 1 || company.length < 1 || isSubmitting
                }
              >
                {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
