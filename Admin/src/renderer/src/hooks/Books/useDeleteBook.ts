import { Book, OperationResult } from '@shared/types/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE hook (delete book in API)
function useDeleteBook(): UseMutationResult<OperationResult, Error, string, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookId: string) => {
      const deleteResponse = await window.electron.ipcRenderer.invoke('deleteOneBook', bookId)

      if (!deleteResponse) {
        return { isSuccess: false, resultMessage: ['Error in deleting this book'] }
      }

      const storeResponse = await window.electron.ipcRenderer.invoke('storeDeletedId', bookId)

      if (!storeResponse) {
        return {
          isSuccess: false,
          resultMessage: ['Successfully deleted this book but error in storing the bookId ']
        }
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
