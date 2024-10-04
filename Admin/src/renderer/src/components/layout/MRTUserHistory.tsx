import { useMemo } from 'react'
import { Button } from '@mui/material'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
// import { darken, lighten } from '@mui/material'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fakeData, type User } from '@renderer/store/fake'
import HistoryDetailPanel from './HistoryDetailPanel'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { utils, write } from 'xlsx'
import { saveAs } from 'file-saver'

function MRTUserHistory(): JSX.Element {
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'Id'
        // size: 80
      },
      {
        accessorKey: 'name',
        header: 'Name'
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },
      {
        accessorKey: 'phoneNumber',
        header: 'phone Number'
      },
      {
        accessorKey: 'addedAt',
        header: 'Added At'
      }
    ],
    []
  )
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers
  } = useGetUsers()

  const exportToExcel = (): void => {
    console.log('exportToExcel')

    // create a new workbook
    const workbook = utils.book_new()

    // prepare data
    const flatData = fetchedUsers.flatMap((user) =>
      user.bookHistory.map((book) => ({
        userId: user._id,
        userName: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        addedAt: user.addedAt,
        bookId: book.id,
        bookName: book.bookName,
        authorName: book.authorName,
        course: book.course,
        sem: book.sem,
        issueDate: book.issueDate.toLocaleString(),
        dueDate: book.dueDate.toLocaleString(),
        returnedDate: book.returnedDate ? book.returnedDate.toLocaleDateString() : 'Not returned',
        fine: book.fine
      }))
    )

    // create worksheet
    const worksheet = utils.json_to_sheet(flatData)

    // add worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, ' User Book History')

    // write a excel file to a binary
    const excelBinary = write(workbook, { type: 'array' })

    const blob = new Blob([excelBinary], { type: 'application/octet-stream' })
    saveAs(blob, 'user_book_history.xlsx')
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    // enableColumnPinning: true,
    enableSorting: false,
    enableExpanding: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableRowNumbers: true,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '-webkit-fill-available'
      }
    },
    muiTableBodyRowProps: ({ row }) => ({
      //conditional styling based on row depth
      onClick: () => row.toggleExpanded(),
      sx: () => ({
        cursor: 'pointer'
        // ':hover': {
        //   bgcolor: '#202020'
        // }
      })
    }),
    renderTopToolbar: () => (
      <Button
        variant="outlined"
        sx={{ m: '1rem' }}
        onClick={() => {
          window.electron.ipcRenderer.invoke('export-excel')
          exportToExcel
        }}
      >
        <FileDownloadOutlinedIcon sx={{ mr: '.5rem' }} /> Export
      </Button>
    ),
    renderDetailPanel: ({ row }) =>
      row.original.bookHistory ? <HistoryDetailPanel data={row.original} /> : null,
    initialState: {
      columnPinning: { left: ['mrt-row-actions'], right: [] },
      // expanded: true,
      pagination: { pageSize: 50, pageIndex: 0 }
    },
    state: {
      isLoading: isLoadingUsers,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers
    }
  })

  return <MaterialReactTable table={table} />
}

function useGetUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      return Promise.resolve(fakeData)
    },
    refetchOnWindowFocus: false
  })
}

export default MRTUserHistory
