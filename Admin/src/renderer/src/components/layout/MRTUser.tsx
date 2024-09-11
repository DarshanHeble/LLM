import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable
} from 'material-react-table'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { validateRequired } from '@renderer/utils/validation'
import { User } from '@shared/types'
import { useCreateUser, useDeleteUser, useGetUsers, useUpdateUser } from '@renderer/hooks'
import { useAlertToast } from '../feedback/AlertToast'
import { useConfirmationDialog } from '../feedback/confirmationDialog'

const MaterialTable = (): JSX.Element => {
  const { showAlert } = useAlertToast()
  const { showConfirmation } = useConfirmationDialog()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'Id',
        enableEditing: true,
        size: 80,
        enableClickToCopy: true
      },
      // {
      //   accessorKey: 'userId',
      //   header: 'User ID',
      //   size: 100
      // },
      {
        accessorKey: 'name',
        header: 'Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined
            })
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined
            })
        }
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.phoneNumber,
          helperText: validationErrors?.phoneNumber,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phoneNumber: undefined
            })
        }
      },
      {
        accessorKey: 'noOfIssuedBooks',
        header: 'No of Issued Books',
        enableEditing: false,
        size: 100
      }
    ],
    [validationErrors]
  )

  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers
  } = useGetUsers()
  console.log('user', fetchedUsers)

  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()

  const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidationErrors = validateUser(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    const isSuccess = await createUser(values)
    if (isSuccess) {
      table.setCreatingRow(null)
      showAlert('Successfully created new user', 'success')
    } else {
      showAlert('Failed to create user', 'error')
    }
  }

  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateUser(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    await updateUser(values)
    table.setEditingRow(null)
  }

  const openDeleteConfirmModal = (row: MRT_Row<User>): void => {
    // if (window.confirm('Are you sure you want to delete this user?')) {
    //   deleteUser(row.original._id)
    // }
    showConfirmation({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user',
      onConfirm() {
        deleteUser(row.original._id)
        showAlert('User deleted successfully', 'success')
      }
    })
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    enableSorting: false,
    enableRowNumbers: true,

    getRowId: (row) => row._id,
    initialState: {
      // columnVisibility: { id: false },
      columnOrder: [
        'mrt-row-numbers',
        // 'mrt-row-select',
        '_id',
        // 'bookId',
        'name',
        'email',
        'phoneNumber',
        'noOfIssuedBooks',
        'mrt-row-actions'
      ]
    },
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px'
      }
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers
    }
  })

  return (
    <>
      {/* <AlertToast
        open={isError}
        severity="error"
        message="Failed to add new user. There might be already a User with the specified Id"
        onClose={() => setIsError(false)}
      /> */}
      <MaterialReactTable table={table} />
    </>
  )
}

const queryClient = new QueryClient()
function MRTUser(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <MaterialTable />
    </QueryClientProvider>
  )
}

export default MRTUser

const validateEmail = (email: string): false | RegExpMatchArray | null =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )

const validatePhoneNumber = (phoneNumber: number): boolean => !!phoneNumber.toString().length

function validateUser(user: User): {
  name: string
  email: string
  phoneNumber: string
} {
  return {
    name: !validateRequired(user.name) ? 'Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
    phoneNumber: !validatePhoneNumber(user.phoneNumber) ? 'Phone Number is Required' : ''
  }
}
