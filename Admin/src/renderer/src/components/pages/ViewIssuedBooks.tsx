import { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { viewIssuedBookType } from '@shared/types'

const drawerWidth = 240

const MaterialTable = (): JSX.Element => {
  const [tableData, setTableData] = useState<viewIssuedBookType[]>([])

  const columns = useMemo<MRT_ColumnDef<viewIssuedBookType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'User ID',
        size: 80
      },
      {
        accessorKey: 'issueDate',
        header: 'Issue Date'
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date'
      },
      {
        accessorKey: 'returnStatus',
        header: 'Return Status'
      }
    ],
    []
  )

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const userData = await window.electron.ipcRenderer.invoke('getUserData')
        console.log(userData)

        // Assuming userData contains an array of users with issued book data
        const issuedBooks: viewIssuedBookType[] = userData.flatMap((user) =>
          user.issuedBook.map((issuedBook) => ({
            id: issuedBook.bookId, // Adjust this based on your data structure
            issueDate: new Date(issuedBook.issueDate).toLocaleDateString(),
            dueDate: new Date(issuedBook.dueDate).toLocaleDateString(),
            returnStatus: issuedBook.returnStatus
          }))
        )
        setTableData(issuedBooks)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [])

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableSorting: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px'
      }
    },
    state: {
      isLoading: false, // Replace with your loading state
      isSaving: false, // Replace with your saving state
      showAlertBanner: false, // Replace with your alert state
      showProgressBars: false // Replace with your progress state
    }
  })

  return <MaterialReactTable table={table} />
}

function ViewIssuedBooks(): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <SIdebar text="View Issued Books" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 7
        }}
      >
        <MaterialTable />
      </Box>
    </Box>
  )
}

export default ViewIssuedBooks
