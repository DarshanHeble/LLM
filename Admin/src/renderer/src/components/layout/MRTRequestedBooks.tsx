import { useGetBooks } from '@renderer/hooks'
import { Book } from '@shared/types/types'
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { useMemo } from 'react'

function MRTRequestedBooks(): JSX.Element {
  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'Id'
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name'
      }
    ],
    []
  )
  // call READ hook
  const {
    data: fetchedBooks = [],
    isError: isLoadingBooksError,
    isFetching: isFetchingBooks,
    isLoading: isLoadingBooks
  } = useGetBooks()

  const table = useMaterialReactTable({
    columns,
    data: fetchedBooks,
    getRowId: (row) => row._id,
    initialState: {
      // columnVisibility: { id: false },
      columnOrder: [
        'mrt-row-numbers',
        // 'mrt-row-select',
        '_id',
        'bookName'
        // 'authorName',
        // 'course',
        // 'sem',
        // 'quantity',
        // 'mrt-row-actions'
      ],
      pagination: {
        pageSize: 50,
        pageIndex: 0
      }
    },
    state: {
      isLoading: isLoadingBooks,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isFetchingBooks
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTRequestedBooks
