import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable
} from 'material-react-table'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import SIdebar from '../layout/Sidebar'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { validateRequired } from '@renderer/utils/validation'

// Types
export type issuedBookType = {
  bookId: string
  issueDate: Date
  dueDate: Date
  returnStatus: boolean
}

export type User = {
  id: string
  userId: string
  name: string
  email: string
  phoneNumber: number
  noOfIssuedBooks: number
  issuedBook: issuedBookType[]
}

const MaterialTable = (): JSX.Element => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'userId',
        header: 'User ID',
        size: 100
      },
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
    await createUser(values)
    table.setCreatingRow(null)
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id)
    }
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    enableSorting: false,
    getRowId: (row) => row.id,
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

  return <MaterialReactTable table={table} />
}

//READ hook (get users from api)
function useGetUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // Fetch user data from the Electron API
      const userData = await window.electron.ipcRenderer.invoke('getUserData')
      return Promise.resolve(userData)
    },
    refetchOnWindowFocus: false
  })
}

//CREATE hook (post new user to api)
function useCreateUser(): UseMutationResult<
  User,
  Error,
  User,
  { previousUsers: User[] | undefined }
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: User) => {
      // Send API request to add a new user
      const userId = await window.electron.ipcRenderer.invoke('addNewUser', user)
      return { ...user, id: userId } // Return the user with the assigned ID
    },
    // Client-side optimistic update
    onMutate: async (newUserInfo: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })

      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
        const newUser = { ...newUserInfo, id: '', noOfIssuedBooks: 0, issuedBook: [] }
        return prevUsers ? [...prevUsers, newUser] : [newUser]
      })

      return { previousUsers }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onSuccess: (data: User) => {
      queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
        if (!prevUsers) return [data]
        return prevUsers.map((user) => (user.userId === data.userId ? data : user))
      })
    }
  })
}

function useUpdateUser(): UseMutationResult<void, Error, User, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: User) => {
      await window.electron.ipcRenderer.invoke('editUser', user)
      //   await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.map((prevUser: User) =>
          prevUser.id === newUserInfo.id
            ? { ...newUserInfo, noOfIssuedBooks: newUserInfo.issuedBook.length }
            : prevUser
        )
      )
    }
  })
}

function useDeleteUser(): UseMutationResult<void, Error, string, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      await window.electron.ipcRenderer.invoke('deleteUser', userId)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user.id !== userId)
      )
    }
  })
}

const queryClient = new QueryClient()
function MRTReturn(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <MaterialTable />
    </QueryClientProvider>
  )
}

export default MRTReturn

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
