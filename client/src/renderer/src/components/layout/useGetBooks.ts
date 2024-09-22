import { fakeBookData } from '@renderer/mocks/fakeData'
import { Book } from '@shared/types/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

function useGetBooks(): UseQueryResult<Book[], Error> {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const data = fakeBookData
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return data
    }
  })
}

export default useGetBooks
