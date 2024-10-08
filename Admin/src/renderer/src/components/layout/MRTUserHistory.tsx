import { useMemo } from 'react'
import { Button } from '@mui/material'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
// import { darken, lighten } from '@mui/material'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import HistoryDetailPanel from './HistoryDetailPanel'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import exportToExcel from '@renderer/utils/exports'
import { UserHistory } from '@shared/types/types'

function MRTUserHistory(): JSX.Element {
  const columns = useMemo<MRT_ColumnDef<UserHistory>[]>(
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
  const handleExport = (): void => {
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
          returnedDate: book.returnedDate ? book.returnedDate.toLocaleString() : 'Not returned',
          fine: book.fine,
          barcode: user._id
        }
      })
    )

    //call function to export the excel file
    exportToExcel(flatData, 'users History')
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
          handleExport()
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

function useGetUsers(): UseQueryResult<UserHistory[], Error> {
  return useQuery<UserHistory[]>({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      const data: UserHistory[] = await window.electron.ipcRenderer.invoke('getUserHistory')
      await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      return data
    },
    refetchOnWindowFocus: false
  })
}

export default MRTUserHistory