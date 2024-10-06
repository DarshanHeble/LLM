import { useMemo } from 'react'
import { Button } from '@mui/material'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
// import { darken, lighten } from '@mui/material'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fakeData, type User } from '@renderer/store/fake'
import HistoryDetailPanel from './HistoryDetailPanel'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { utils, WorkBook, WorkSheet, write } from 'xlsx'
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

  // Function to export user book history to an Excel file
  const exportToExcel = (): void => {
    // Prepare data
    const flatData = fetchedUsers.flatMap((user) =>
      user.bookHistory.map((book) => {
        return {
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
          fine: book.fine,
          barcode: `*${user._id}*` // Wrap _id with asterisks for barcode
        }
      })
    )

    // Create a new workbook and a worksheet from the flat data
    const workbook: WorkBook = utils.book_new()
    const worksheet: WorkSheet = utils.json_to_sheet(flatData)

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'User Book History')

    // Write the Excel file to a binary
    const excelBinary = write(workbook, { type: 'array' })

    // Create a blob and trigger download
    const blob = new Blob([excelBinary], { type: 'application/octet-stream' })
    saveAs(blob, 'user_book_history_with_barcodes.xlsx')

    // Show a message to the user
    alert(
      "Please open the Excel file and select the 'barcode' column, then change the font to 'Libre Barcode 39' to see the barcodes."
    )
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
    renderTopToolbarCustomActions: () => (
      <Button
        variant="outlined"
        sx={{ m: '1rem' }}
        onClick={() => {
          // window.electron.ipcRenderer.invoke('export-excel')
          exportToExcel()
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
