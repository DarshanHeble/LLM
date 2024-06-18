import { User } from '@renderer/store/types'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'

//CREATE hook (post new user to api)
export function useCreateUser(): UseMutationResult<void, unknown, User, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      return Promise.resolve()
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(
        ['users'],
        (prevUsers: any) =>
          [
            ...prevUsers,
            {
              ...newUserInfo,
              id: (Math.random() + 1).toString(36).substring(7)
            }
          ] as User[]
      )
    }
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  })
}
