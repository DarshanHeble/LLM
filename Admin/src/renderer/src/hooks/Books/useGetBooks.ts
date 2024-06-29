import { Book } from '@shared/types'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

// READ hook (get books from api)
function useGetBooks(): UseQueryResult<Book[], Error> {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const re = await window.electron.ipcRenderer.invoke('getBookData')
      return re
    },
    refetchOnWindowFocus: false
  })
}

export default useGetBooks
