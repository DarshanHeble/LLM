import { User } from '@shared/types'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

//READ hook (get users from api)
function useGetUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // Fetch user data from the Electron API
      const userData = await window.electron.ipcRenderer.invoke('getUserData')
      return Promise.resolve(userData)
    },
    refetchOnWindowFocus: false
  })
}
export default useGetUsers
