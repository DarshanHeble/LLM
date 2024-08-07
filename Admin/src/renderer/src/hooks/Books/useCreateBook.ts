import { Book } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// CREATE hook (post new book to api)
function useCreateBook(): UseMutationResult<
  Book,
  Error,
  Book,
  { previousBooks: Book[] | undefined }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (book: Book) => {
      const typeSafedBook = {
        authorName: book.authorName,
        bookName: book.bookName,
        course: book.course,
        noOfBooks: Number(book.noOfBooks),
        sem: Number(book.sem)
      }
      const newBookId = await window.electron.ipcRenderer.invoke('addNewBook', typeSafedBook)

      const updatedBook = {
        ...book,
        id: newBookId
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return the updated book object
      return updatedBook
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
    onSuccess: (updatedBook) => {
      // Update the local query data with the actual book ID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData<Book[]>(['books'], (prevBooks: any) =>
        prevBooks?.map((book: Book) => (book.id === updatedBook.id ? updatedBook : book))
      )
    },
    onSettled: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })
}

export default useCreateBook
