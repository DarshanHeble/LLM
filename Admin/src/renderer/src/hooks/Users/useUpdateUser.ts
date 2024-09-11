import { User } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

function useUpdateUser(): UseMutationResult<void, Error, User, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: User) => {
      console.log(user)

      await window.electron.ipcRenderer.invoke('editUser', user)
      //   await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (newUserInfo: User) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.map((prevUser: User) =>
          prevUser._id === newUserInfo._id
            ? {
                ...newUserInfo,
                noOfIssuedBooks: newUserInfo.issuedBook ? newUserInfo.issuedBook.length : 0
              }
            : prevUser
        )
      )
    }
  })
}

export default useUpdateUser
