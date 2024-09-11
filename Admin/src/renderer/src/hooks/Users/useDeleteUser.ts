import { User } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

function useDeleteUser(): UseMutationResult<void, Error, string, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      await window.electron.ipcRenderer.invoke('deleteUser', userId)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (userId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user._id !== userId)
      )
    }
  })
}

export default useDeleteUser
