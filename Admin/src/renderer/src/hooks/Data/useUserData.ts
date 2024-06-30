import { useState, useEffect } from 'react'
import { User } from '@shared/types'

type UserProp = {
  userData: User[]
  setUserData: React.Dispatch<React.SetStateAction<User[]>>
  loading: boolean
  error: string | null
}

const useUserData = (): UserProp => {
  const [userData, setUserData] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        const result = await window.electron.ipcRenderer.invoke('getUserData')
        setUserData(result)
      } catch (err) {
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return { userData, setUserData, loading, error }
}

export default useUserData
