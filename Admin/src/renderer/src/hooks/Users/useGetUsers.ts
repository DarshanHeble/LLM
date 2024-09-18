import { User } from '@shared/types/types'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

// READ hook (get users from api)
function useGetUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Fetch user data from the Electron API
        const userData = await window.electron.ipcRenderer.invoke('getUserData')
        console.log('user', userData)

        const usersWithCorrectIssuedBooks = userData.map((user: User) => ({
          ...user,
          noOfIssuedBooks: Array.isArray(user.issuedBooks) ? user.issuedBooks.length : 0
        }))
        console.log('format', usersWithCorrectIssuedBooks)

        return Promise.resolve(usersWithCorrectIssuedBooks)
      } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch user data')
      }
    },
    refetchOnWindowFocus: false
  })
}

export default useGetUsers
