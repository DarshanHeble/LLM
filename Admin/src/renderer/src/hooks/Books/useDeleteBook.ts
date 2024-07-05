import { Book } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE hook (delete book in api)
function useDeleteBook(): UseMutationResult<void, Error, string, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookId: string) => {
      console.log(bookId)

      const result = window.electron.ipcRenderer.invoke('deleteOneBook', bookId)
      console.log(result)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (bookId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['books'], (prevBooks: any) =>
        prevBooks?.filter((book: Book) => book.id !== bookId)
      )
    }
  })
}
export default useDeleteBook
