import { User } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

//CREATE hook (post new user to api)
function useCreateUser(): UseMutationResult<
  User,
  Error,
  User,
  { previousUsers: User[] | undefined }
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: User) => {
      // Send API request to add a new user
      await window.electron.ipcRenderer.invoke('addNewUser', user)
      return user // Return the user object as is (without ID handling)
    },
    // Client-side optimistic update
    onMutate: async (newUserInfo: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })

      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
        const newUser = { ...newUserInfo, noOfIssuedBooks: 0, issuedBook: [] }
        return prevUsers ? [...prevUsers, newUser] : [newUser]
      })

      return { previousUsers }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onSuccess: (data: User) => {
      queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
        if (!prevUsers) return [data]
        return [...prevUsers, data] // Simply add the new user to the list
      })
    }
  })
}

export default useCreateUser

///

// import { User } from '@shared/types'
// import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// //CREATE hook (post new user to api)
// function useCreateUser(): UseMutationResult<
//   User,
//   Error,
//   User,
//   { previousUsers: User[] | undefined }
// > {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (user: User) => {
//       // Send API request to add a new user
//       const userId = await window.electron.ipcRenderer.invoke('addNewUser', user)
//       return { ...user, id: userId } // Return the user with the assigned ID
//     },
//     // Client-side optimistic update
//     onMutate: async (newUserInfo: User) => {
//       await queryClient.cancelQueries({ queryKey: ['users'] })

//       const previousUsers = queryClient.getQueryData<User[]>(['users'])

//       queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
//         const newUser = { ...newUserInfo, id: '', noOfIssuedBooks: 0, issuedBook: [] }
//         return prevUsers ? [...prevUsers, newUser] : [newUser]
//       })

//       return { previousUsers }
//     },
//     onError: (_, __, context) => {
//       queryClient.setQueryData(['users'], context?.previousUsers)
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] })
//     },
//     onSuccess: (data: User) => {
//       queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
//         if (!prevUsers) return [data]
//         return prevUsers.map((user) => (user._id === data._id ? data : user))
//       })
//     }
//   })
// }
// export default useCreateUser
