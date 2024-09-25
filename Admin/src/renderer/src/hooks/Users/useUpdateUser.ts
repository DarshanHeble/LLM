import { User, OperationResult } from '@shared/types/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

function useUpdateUser(): UseMutationResult<
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

        // Invoke the Electron API to update the user data
        const result: boolean = await window.electron.ipcRenderer.invoke('editUser', user)

        if (!result) {
          return { isSuccess: false, resultMessage: ['Error while updating the user'] }
        }

        return { isSuccess: true, resultMessage: ['User updated successfully'] }
      } catch (error) {
        console.error('Error during user update:', error)
        return { isSuccess: false, resultMessage: ['Failed to update the user'] }
      }
    },
    onMutate: async (newUserInfo: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // Snapshot the previous user data for rollback in case of error
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      // Optimistically update the cached user list
      queryClient.setQueryData<User[]>(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser._id === newUserInfo._id
            ? {
                ...newUserInfo,
                noOfIssuedBooks: newUserInfo.issuedBooks ? newUserInfo.issuedBooks.length : 0
              }
            : prevUser
        )
      )

      // Return a context object with the previous users for rollback
      return { previousUsers }
    },
    onError: (error, _newUserInfo, context) => {
      console.error('Error during user update:', error)

      // Rollback the optimistic update by restoring the previous users data
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      // Invalidate the users query to refetch the latest data after mutation
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export default useUpdateUser
