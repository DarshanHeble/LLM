import { User } from '@shared/types'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

//READ hook (get users from api)
function useGetUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // Fetch user data from the Electron API
      const userData = await window.electron.ipcRenderer.invoke('getUserData')

      const usersWithCorrectIssuedBooks = userData.map((user: User) => ({
        ...user,
        noOfIssuedBooks: user.issuedBook.length
      }))
      return Promise.resolve(usersWithCorrectIssuedBooks)
    },
    refetchOnWindowFocus: false
  })
}
export default useGetUsers
