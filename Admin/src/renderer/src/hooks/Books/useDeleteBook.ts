import { Book, OperationResult } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE hook (delete book in API)
function useDeleteBook(): UseMutationResult<OperationResult, Error, string, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookId: string) => {
      const response = await window.electron.ipcRenderer.invoke('deleteOneBook', bookId)

      if (!response) {
        throw new Error('Error deleting this book')
      }

      return { isSuccess: true, resultMessage: ['Successfully deleted this book'] }
    },
    onMutate: async (bookId: string) => {
      await queryClient.cancelQueries({ queryKey: ['books'] })

      // Optimistically update cache by removing the deleted book
      queryClient.setQueryData<Book[]>(['books'], (prevBooks) =>
        prevBooks ? prevBooks.filter((book) => book._id !== bookId) : []
      )
    },
    onError: (error: Error, bookId: string) => {
      // context: void
      console.error(`Failed to delete book with ID ${bookId}:`, error.message)

      // Optionally, revert optimistic update if mutation fails
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onSettled: () => {
      // Invalidate or refetch the query to ensure we have up-to-date data
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })
}

export default useDeleteBook
