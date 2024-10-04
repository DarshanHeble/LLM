import { useEffect, useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable
} from 'material-react-table'
import { Box, Fab, IconButton, Tooltip } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { validateRequired } from '@renderer/utils/validation'
import { User } from '@shared/types/types'
import { useCreateUser, useDeleteUser, useGetUsers, useUpdateUser } from '@renderer/hooks'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { useConfirmationDialog } from '../Context/feedback/confirmationDialog'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import CreateUserDialog from '../dialog/createUserDialog'
import EditUserDialog from '../dialog/editUserDialog'

const MaterialTable = (): JSX.Element => {
  const { showAlert } = useAlertToast()
  const { showConfirmation } = useConfirmationDialog()
  const [isMounted, setIsMounted] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [newUserData, setNewUserData] = useState<User>({
    _id: '',
    name: '',
    email: '',
    phoneNumber: '',
    issuedBooks: [],
    noOfIssuedBooks: 0,
    password: '',
    requestedBooks: [],
    addedAt: new Date()
  })
  const [editPrevData, setEditPrevData] = useState<User>({
    _id: '',
    email: '',
    password: '',
    issuedBooks: [],
    name: '',
    noOfIssuedBooks: 0,
    phoneNumber: '',
    requestedBooks: [],
    addedAt: new Date()
  })

  useEffect(() => {
    window.electron.ipcRenderer.on('newUserData', async (_event, data: User) => {
      console.log('data form client', data)
      setNewUserData((prevData: User) => {
        if (prevData !== data) {
          return data
        } else {
          return prevData
        }
      })
      // handleCreateFormSubmit(data)
    })
  }, [])

  useEffect(() => {
    if (isMounted) {
      // This will run only after the first render
      console.log(newUserData)
      handleCreateFormSubmit(newUserData)
    } else {
      // Skip the first render
      setIsMounted(true)
    }
  }, [newUserData])

  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'Id',
        enableEditing: true,
        size: 80,
        enableClickToCopy: true,
        muiEditTextFieldProps: {
          // variant: 'outlined',
          // margin: 'normal',
          // size: 'medium',
          required: true
        }
      },
      {
        accessorKey: 'name',
        header: 'Name',
        muiEditTextFieldProps: {
          // variant: 'outlined',
          // size: 'medium',
          // margin: 'normal',
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
          // variant: 'outlined',
          // margin: 'normal',
          // size: 'medium',
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
          // margin: 'normal',
          // size: 'medium',
          // variant: 'outlined',
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
        // muiEditTextFieldProps: {
        //   margin: 'normal',
        //   size: 'medium',
        //   variant: 'outlined'
        // }
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

  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()

  const handleCreateFormSubmit = async (newUserFormData: User): Promise<void> => {
    const result = await createUser(newUserFormData)
    // handle response in the UI
    if (result.isSuccess) {
      showAlert(result.resultMessage[0], 'success')
    } else {
      console.log('error')
      showAlert(result.resultMessage[0], 'error')
    }
  }

  const handleEditFormSubmit = async (updatedUserFormData: User): Promise<void> => {
    console.log(updatedUserFormData)

    const result = await updateUser(updatedUserFormData)
    // handle response in the UI
    if (result.isSuccess) {
      table.setEditingRow(null)
      showAlert(result.resultMessage[0], 'success')
    } else {
      console.log('error')
      showAlert(result.resultMessage[0], 'error')
    }
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
    createDisplayMode: 'custom',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableSorting: false,
    enableRowNumbers: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,

    getRowId: (row) => row._id,
    initialState: {
      // columnVisibility: { _id: false },
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
      ],
      pagination: {
        pageSize: 50,
        pageIndex: 0
      }
    },
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    muiTablePaperProps: {
      sx: {
        display: 'flex',
        flexDirection: 'column',
        height: '-webkit-fill-available'
      }
    },
    muiTableContainerProps: {
      sx: {
        height: '-webkit-fill-available'
      }
    },
    // onCreatingRowCancel: () => setValidationErrors({}),
    // onCreatingRowSave: handleCreateUser,
    // onEditingRowCancel: () => setValidationErrors({}),
    // onEditingRowSave: handleSaveUser,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              setEditPrevData(row.original)
              setOpenEditDialog(true)
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    // renderTopToolbarCustomActions: ({ table }) => (
    renderTopToolbarCustomActions: () => (
      <Fab
        variant="extended"
        onClick={() => {
          // table.setCreatingRow(true)
          setOpenCreateDialog(true)
        }}
        sx={{
          textTransform: 'none',
          mb: '1rem'
        }}
      >
        <PersonAddAlt1Icon sx={{ mr: '1rem' }} /> Create New User
      </Fab>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers
    },
    icons: {
      ViewColumnIcon: () => <ViewColumnOutlinedIcon />
    }
  })

  return (
    <>
      {openEditDialog && (
        <EditUserDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSubmit={handleEditFormSubmit}
          prevData={editPrevData}
        />
      )}
      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={handleCreateFormSubmit}
      />

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

const validatePhoneNumber = (phoneNumber: string): boolean => !!phoneNumber.toString().length

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
