import { useMemo } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
// import { darken, lighten } from '@mui/material'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fakeData, type User } from '@renderer/store/fake'
import HistoryDetailPanel from './HistoryDetailPanel'

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
