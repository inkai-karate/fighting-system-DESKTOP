import { IErrorResponse } from '@renderer/interface/response.interface'
import { IStudent } from '@renderer/interface/student.interface'
import StudentService from '@renderer/services/studentService'
import { toastMessage } from '@renderer/utils/optionsData'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null
  const studentService = StudentService()

  const [dataStudent, setDataStudent] = useState<IStudent | null>(null)
  const [loading, setLoading] = useState({
    fetchDetailUser: false,
    joinRoom: false
  })
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [roomCode, setRoomCode] = useState('')

  useEffect(() => {
    const fetchUserDetail = async (): Promise<void> => {
      try {
        setLoading({ ...loading, fetchDetailUser: true })
        const response = await studentService.getDetailStudent(userData.students[0].uuid)
        if (response.success) {
          setDataStudent(response.data || null)
        }
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>
        const errorData = axiosError.response?.data?.message
        const { title, desc } = toastMessage.loadError('siswa')
        toast.error(title, {
          description: errorData || desc
        })
      } finally {
        setLoading({ ...loading, fetchDetailUser: false })
      }
    }
    fetchUserDetail()
  }, [])

  return {
    dataStudent,
    loading,
    isRoomModalOpen,
    setIsRoomModalOpen,
    roomCode,
    setRoomCode
  }
}
