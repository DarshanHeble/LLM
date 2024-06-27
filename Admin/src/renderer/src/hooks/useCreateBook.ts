import { Book } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// CREATE hook (post new book to api)
function useCreateBook(): UseMutationResult<void, Error, Book, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (book: Book) => {
      const newBookId = await window.electron.ipcRenderer.invoke('addNewBook', book)

      const updatedBook = {
        ...book,
        id: newBookId // Assuming newBookId is the ID retrieved from IPC
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return the updated book object
      return updatedBook
    },
    onMutate: (newBookInfo: Book) => {
      // Optimistically update the local query data
      const previousBooks = queryClient.getQueryData<Book[]>(['books'])

      queryClient.setQueryData<Book[]>(['books'], (prevBooks: any) => [...prevBooks, newBookInfo])

      // Return the context to use in case of error to rollback
      return { previousBooks }
    },
    onError: (error, newBookInfo, context) => {
      // Rollback optimistic update on error
      if (context?.previousBooks) {
        queryClient.setQueryData<Book[]>(['books'], context.previousBooks)
      }
    },
    onSuccess: (updatedBook) => {
      // Update the local query data with the actual book ID
      queryClient.setQueryData<Book[]>(['books'], (prevBooks: any) =>
        prevBooks?.map((book: Book) => (book.bookId === updatedBook.bookId ? updatedBook : book))
      )
    },
    onSettled: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['books'])
    }
  })
}

export default useCreateBook
