import { sendBookDataToClient } from '@renderer/utils'
import { Book, OperationResult, Other } from '@shared/types/types'
import generateBookId from '@shared/utils/generateBookId'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// CREATE hook (post new book to api)
function useCreateBook(): UseMutationResult<
  OperationResult,
  Error,
  Book,
  { previousBooks: Book[] | undefined }
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (book: Book) => {
      const result = await generateBookId() // get the new Id and other data which contains book id counter

      if (!result || !result[0]) {
        return { isSuccess: false, resultMessage: ['Error in generating Book ID'] } // return false if the data is null
      }

      const [book_id, updatedOtherData] = result // separate both data into variables
      const currentDateTime = new Date()

      const newBookData: Book = {
        ...book,
        _id: book_id,
        sem: Number(book.sem),
        quantity: Number(book.quantity),
        addedAt: currentDateTime
      }

      // first update the book count in db if no error is occurred then add the new book
      const isUpdateSuccess = await window.electron.ipcRenderer.invoke(
        'updateBookCount',
        updatedOtherData
      )
      if (!isUpdateSuccess) {
        return { isSuccess: false, resultMessage: ['Error in updating book ID counter'] }
      }

      // if an error is encountered then reUpdate the book count
      const isAddBookSuccess = await window.electron.ipcRenderer.invoke('addNewBook', newBookData)
      // console.log('is book added', isAddBookSuccess)

      if (!isAddBookSuccess) {
        // revert the book count
        const updatedData: Other = {
          ...updatedOtherData,
          bookCount: updatedOtherData.bookCount - 1
        }
        const response = await window.electron.ipcRenderer.invoke('updateBookCount', updatedData)

        if (!response) {
          return {
            isSuccess: false,
            resultMessage: [
              'Error in adding new Book Data and unable to update the book Id counter'
            ]
          }
        }
        return { isSuccess: false, resultMessage: ['Error in adding new Book Data'] }
      }

      sendBookDataToClient()
      return { isSuccess: true, resultMessage: ['Successfully added new book'] }
    },
    onMutate: (newBookInfo: Book) => {
      // Optimistically update the local query data
      const previousBooks = queryClient.getQueryData<Book[]>(['books'])

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
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onSettled: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })
}

export default useCreateBook
