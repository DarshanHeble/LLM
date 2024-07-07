import { Book } from '@shared/types'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

// UPDATE hook (put book in api)
function useUpdateBook(): UseMutationResult<void, Error, Book, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (book: Book) => {
      console.log(book)

      const result = window.electron.ipcRenderer.invoke('updateBookData', book).then((re) => {
        console.log(re)
      })
      console.log(result)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (newBookInfo: Book) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['books'], (prevBooks: any) =>
        prevBooks?.map((prevBook: Book) =>
          prevBook.id === newBookInfo.id ? newBookInfo : prevBook
        )
      )
    }
  })
}
export default useUpdateBook
