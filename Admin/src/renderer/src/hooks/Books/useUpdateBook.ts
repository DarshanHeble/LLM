import { sendBookDataToClient } from '@renderer/utils'
import { Book, OperationResult } from '@shared/types/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// UPDATE hook (put book in api)
function useUpdateBook(): UseMutationResult<
  OperationResult,
  Error,
  Book,
  { previousBooks: Book[] | undefined }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (book: Book) => {
      console.log(book)

      // Fetch the current data of the book to ensure only changed fields are updated
      const prevData: Book = await window.electron.ipcRenderer.invoke('getOneBookData', book._id)
      console.log(prevData)

      const updatedBook: Book = {
        ...prevData,
        authorName: book.authorName,
        bookName: book.bookName,
        course: book.course,
        quantity: Number(book.quantity),
        sem: Number(book.sem)
      }

      // Invoke the updateBookData API to update the book details
      const result: boolean = await window.electron.ipcRenderer.invoke(
        'updateBookData',
        updatedBook
      )

      if (!result) {
        return { isSuccess: false, resultMessage: ['Error while updating the book'] }
      }
      sendBookDataToClient()
      return { isSuccess: true, resultMessage: ['Successfully updated the book'] }
    },
    onMutate: async (newBookInfo: Book) => {
      await queryClient.cancelQueries({ queryKey: ['books'] })

      // Snapshot the previous value for rollback in case of error
      const previousBooks = queryClient.getQueryData<Book[]>(['books'])

      // Optimistically update the cached books list
      queryClient.setQueryData<Book[]>(['books'], (prevBooks) =>
        prevBooks?.map((prevBook) => (prevBook._id === newBookInfo._id ? newBookInfo : prevBook))
      )

      // Return a context object with the snapshotted previous value for rollback
      return { previousBooks }
    },
    onError: (error, _newBookInfo, context) => {
      console.error('Error during book update:', error)

      // Rollback the optimistic update by restoring the previous books data
      if (context?.previousBooks) {
        queryClient.setQueryData<Book[]>(['books'], context.previousBooks)
      }
    },
    onSettled: () => {
      // Invalidate the books query to refetch the latest data after the mutation
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })
}

export default useUpdateBook
