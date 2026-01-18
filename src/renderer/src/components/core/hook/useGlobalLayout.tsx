import ComputerDeviceService from '@renderer/services/computerDeviceService'
import { useConfigStore } from '@renderer/store/configProvider'
import { byPassSubs } from '@renderer/utils/config'
import { getDigitMD5Serial, recursiveMD5 } from '@renderer/utils/myFunctions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseGlobalLayout = () => {
  const navigate = useNavigate()
  const computerDeviceService = ComputerDeviceService()
  const { config } = useConfigStore.getState()
  const myLicense = config?.license

  const [deviceId, setDeviceId] = useState<string>('')
  const [deviceName, setDeviceName] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [licenseIs, setLicenseIs] = useState<boolean>(false)
  const [registered, setRegistered] = useState<boolean>(false)
  const [isExpired, setIsExpired] = useState<boolean>(true)

  const checkIDDevice = async (): Promise<void> => {
    window.electron.ipcRenderer.send('get-deviceID')

    let secProductId = 'no'
    let secLicense = 'no'

    const handleResponse = (_: Electron.IpcRendererEvent, data: string): void => {
      secProductId = data.replace('UUID', '').trim()
      setDeviceId(secProductId)
    }

    window.electron.ipcRenderer.once('uuid-response', handleResponse)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      secLicense = getDigitMD5Serial(recursiveMD5('2021VMS2025' + secProductId, 10))
      // console.log('id', secProductId)
      // console.log('ex', secLicense)
      // console.log('my', myLicense)

      if (secLicense === myLicense) {
        setLicenseIs(true)
        console.log('license valid')
      } else {
        console.log('license invalid')
      }
    } catch (error) {
      console.error(`Error License ${error}`)
    }
  }

  const getDeviceName = async (): Promise<void> => {
    try {
      const res = await window.api.getDeviceLabel()

      if (res?.hostname) {
        const label = `${res.hostname} (${res.platform})`
        setDeviceName(label)
      }
    } catch (error) {
      console.error('Failed to get device name', error)
    }
  }

  const checkingRegister = async (id: string): Promise<void> => {
    try {
      if (byPassSubs) {
        setRegistered(true)
        setIsExpired(false)
        return
      }
      const response = await computerDeviceService.getDetailComputerDeviceByDeviceId(id)

      if (response.success) {
        setRegistered(true)
        const validity = response.data?.validity_period
        if (validity) {
          const validityDate = new Date(validity).getTime()
          const now = Date.now()
          setIsExpired(validityDate < now)
        } else {
          setIsExpired(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleResponse = (_: Electron.IpcRendererEvent, data: string): void => {
      const id = data.replace('UUID', '').trim()
      setDeviceId(id)
      checkingRegister(id)
    }

    window.electron.ipcRenderer.on('uuid-response', handleResponse)

    return () => {
      window.electron.ipcRenderer.removeListener('uuid-response', handleResponse)
    }
  }, [])

  useEffect(() => {
    checkIDDevice()
    getDeviceName()
  }, [])

  // 🔥 Listener F12
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault()
        setShowModal(true)
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        navigate('/logger')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    deviceId,
    deviceName,
    showModal,
    setShowModal,
    licenseIs,
    registered,
    setRegistered,
    isExpired
  }
}
