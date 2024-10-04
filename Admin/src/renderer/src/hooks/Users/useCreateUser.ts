import { sendUserDataToClient } from '@renderer/utils'
import { User, OperationResult } from '@shared/types/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// CREATE hook (post new user to API)
function useCreateUser(): UseMutationResult<
  OperationResult,
  Error,
  User,
  { previousUsers: User[] | undefined }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: User): Promise<OperationResult> => {
      try {
        console.log(user)

        // Send API request to add a new user
        const response: boolean = await window.electron.ipcRenderer.invoke('addNewUser', user)
        console.log(response)

        if (!response) {
          return { isSuccess: false, resultMessage: ['Error while adding the new user'] }
        }

        sendUserDataToClient()
        return { isSuccess: true, resultMessage: ['User created successfully'] }
      } catch (error) {
        console.error('Error while creating user:', error)
        return { isSuccess: false, resultMessage: ['Failed to create user'] }
      }
    },
    // Client-side optimistic update
    onMutate: async (newUserInfo: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })

      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      // Optimistically update the cached user list
      queryClient.setQueryData<User[]>(['users'], (prevUsers) => {
        const newUser = { ...newUserInfo, noOfIssuedBooks: 0, issuedBook: [] }
        return prevUsers ? [...prevUsers, newUser] : [newUser]
      })

      return { previousUsers }
    },
    onError: (error, _newUserInfo, context) => {
      console.error('Error during user creation:', error)

      // Rollback optimistic update by restoring the previous user data
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      // Invalidate the users query to refetch the latest data after mutation
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    // onSuccess: (data: OperationResult, newUserInfo: User) => {
    onSuccess: () => {
      // if (data.isSuccess) {
      //   console.log(data.resultMessage)

      //   // Since the user creation was successful, we can add the new user to the cache
      //   queryClient.setQueryData<User[]>(['users'], (prevUsers) => {
      //     const newUser = { ...newUserInfo, noOfIssuedBooks: 0, issuedBook: [] }
      //     return prevUsers ? [...prevUsers, newUser] : [newUser]
      //   })
      // } else {
      //   console.error('Error during user creation:', data.resultMessage)
      // }
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export default useCreateUser

// import { User } from '@shared/types/types'
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
