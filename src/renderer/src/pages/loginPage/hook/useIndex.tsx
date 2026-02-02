import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import AuthService from '@services/authService'
import type { IPayloadLogin } from '@interface/auth.interface'
import type { IErrorResponse } from '@interface/response.interface'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { UseGlobalLayout } from '@renderer/components/core/hook/useGlobalLayout'
import { LoggerService } from '@renderer/services/loggerService'
import ComputerDeviceService from '@renderer/services/computerDeviceService'
import { IPayloadComputerDevice } from '@renderer/interface/computerDevice.interface'
import { toastMessage } from '@renderer/utils/optionsData'
import ConfigCompanyService from '@renderer/services/configCompanyService'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const token = localStorage.getItem('token')
  const authService = AuthService()
  const configCompanyService = ConfigCompanyService()
  const computerDeviceService = ComputerDeviceService()
  const { deviceId, deviceName, licenseIs, registered, setRegistered, isExpired } =
    UseGlobalLayout()
  const [formLogin, setFormLogin] = useState<IPayloadLogin>({
    username: '',
    password: ''
  })

  const [company, setCompany] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [errorFormLogin, setErrorFormLogin] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<{ submit: boolean }>({ submit: false })

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormLogin((prev) => ({ ...prev, [name]: value }))
    setErrorFormLogin((prev) => ({ ...prev, [name]: '' }))
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!licenseIs) {
      toast.error('Akses ditolak!', {
        description: `License key tidak valid! Harap hubungi SISTEMPARKIR.COM`
      })
      await LoggerService.error('License Key Tidak valid', 'Gagal login')
      setFormLogin({ username: '', password: '' })
      setLoading({ submit: false })
      return
    }

    const requiredFields: (keyof IPayloadLogin)[] = ['username', 'password']
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (!formLogin[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrorFormLogin(newErrors)
      return
    }

    setLoading({ submit: true })

    try {
      const response = await authService.loginAuth(formLogin)
      const payload = {
        type: 'WAITING_DISPLAY'
      }
      if (response.success) {
        // if (response.data?.user.role === 'STUDENT') {
        localStorage.setItem('userLogin', JSON.stringify(response.data!.user))
        localStorage.setItem('token', response.data!.token)
        toast.success('Login Berhasil', {
          description: `Selamat datang ${response.data!.user.username}`
        })
        if (window.api && window.api.auth) {
          window.api.auth.loginSuccess()
          window.electron?.ipcRenderer.send('create-screen-mirror')
          setTimeout(() => {
            window.electron?.ipcRenderer.send('mirror-to-main', payload)
          }, 300)
        } else {
          window.location.href = '/'
          window.electron?.ipcRenderer.send('create-screen-mirror')
          setTimeout(() => {
            window.electron?.ipcRenderer.send('mirror-to-main', payload)
          }, 300)
        }
        // } else {
        // toast.warning('Login Gagal', {
        // description: `Harap login menggunakan akun siswa!`
        // })
        // }
      } else {
        toast.error('Login Gagal', {
          description: 'Username/Password yang Anda masukkan salah!'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      toast.error('Login Gagal', {
        description: message as string
      })
    } finally {
      setFormLogin({ username: '', password: '' })
      setLoading({ submit: false })
    }
  }

  const submitDevice = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const checkCompany = await configCompanyService.getDetailConfigCompanyBySecret(company)
      if (checkCompany.success) {
        const payload: IPayloadComputerDevice = {
          description: '',
          device_id: deviceId,
          name: deviceName
        }
        const response = await computerDeviceService.createComputerDevice(payload)
        if (response.success) {
          setRegistered(true)
          const { title, desc } = toastMessage.createSuccess('device')
          toast.success(title, {
            description: desc
          })
        } else if (response.status_code === 422) {
          const { title, desc } = toastMessage.createSuccess('device')
          toast.warning(title, {
            description: desc
          })
        } else {
          const { title, desc } = toastMessage.createSuccess('device')
          toast.error(title, {
            description: desc
          })
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const errorData = axiosError.response?.data?.message
      toast.error('Terjadi Kesalahan!', {
        description: errorData || 'Device belum berhasil di daftarkan, silahkan coba lagi'
      })
    } finally {
      setIsSubmitting(false)
      setShowModal(false)
    }
  }

  useEffect(() => {
    if (token) {
      if (window.api && window.api.auth) {
        window.api.auth.loginSuccess()
      } else {
        // Fallback untuk development (browser)
        window.location.href = '/'
      }
    }
  }, [])

  return {
    formLogin,
    handleChange,
    handleLogin,
    loading,
    errorFormLogin,
    submitDevice,
    company,
    setCompany,
    isSubmitting,
    setShowModal,
    showModal,
    deviceId,
    deviceName,
    registered,
    isExpired
  }
}
