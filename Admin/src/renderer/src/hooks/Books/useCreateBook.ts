import { Book } from '@shared/types'
import generateBookId from '@shared/utils/generateBookId'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// CREATE hook (post new book to api)
function useCreateBook(): UseMutationResult<
  boolean,
  Error,
  Book,
  { previousBooks: Book[] | undefined }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (book: Book) => {
      const book_id = await generateBookId()
      if (!book_id) {
        return false
      }
      const newBookData: Book = {
        ...book,
        _id: book_id
      }
      const isSuccess = await window.electron.ipcRenderer.invoke('addNewBook', newBookData)

      if (!isSuccess) {
        return false
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return the updated book object
      return false
    },
    onMutate: (newBookInfo: Book) => {
      // Optimistically update the local query data
      console.log('1', newBookInfo)
      const previousBooks = queryClient.getQueryData<Book[]>(['books'])
      console.log('2', previousBooks)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData<Book[]>(['books'], (prevBooks: any) => [...prevBooks, newBookInfo])

      // Return the context to use in case of error to rollback
      return { previousBooks }
    },
    onError: (_, __, context) => {
      // Rollback optimistic update on error
      if (context?.previousBooks) {
        queryClient.setQueryData<Book[]>(['books'], context.previousBooks)
      }
    },
    onSuccess: () => {
      // Update the local query data with the actual book ID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onSettled: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })
}

export default useCreateBook
