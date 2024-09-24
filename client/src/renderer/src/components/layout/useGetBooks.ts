import { Book } from '@shared/types/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

function useGetBooks(): UseQueryResult<Book[], Error> {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const data = await window.electron.ipcRenderer.invoke('getBookData')
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      return data
    }
  })
}

export default useGetBooks
