import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable
} from 'material-react-table'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { User, issuedBookType } from '@shared/types'

function MRT(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 100
      },
      {
        accessorKey: 'userId',
        header: 'Student ID',
        size: 120,
        muiEditTextFieldProps: {
          type: 'text',
          required: true,
          error: !!validationErrors?.userId,
          helperText: validationErrors?.userId,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              userId: undefined
            })
        }
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 150,
        muiEditTextFieldProps: {
          type: 'text',
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
        size: 120,
        muiEditTextFieldProps: {
          type: 'number',
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
        header: 'Issued Books',
        enableEditing: false,
        size: 100
      }
    ],
    [validationErrors]
  )

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()

  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers
  } = useGetUsers()

  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()

  //CREATE action
  const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    console.log(values)

    const newValidationErrors = validateUser(values)
    console.log('hello', newValidationErrors)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    await createUser(values)
    table.setCreatingRow(null) //exit creating mode
  }

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateUser(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    await updateUser(values)
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<User>): void => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id)
    }
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableSorting: false,
    enableRowNumbers: true,
    getRowId: (row) => row.id,
    // enablePagination: false,
    // enableRowVirtualization: true,
    initialState: {
      // columnVisibility: { id: false },
      columnOrder: [
        'mrt-row-numbers',
        // 'mrt-row-select',
        'id',
        'userId',
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
          table.setCreatingRow(true) //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
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
      //send api request here
      const userData = window.electron.ipcRenderer.invoke('getUserData')
      console.log(userData)

      await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      // return Promise.resolve(userData)
      return userData
    },
    refetchOnWindowFocus: false
  })
}

// CREATE hook (post new User to api)
// function useCreateUser(): UseMutationResult<
//   User,
//   Error,
//   User,
//   { previousUsers: User[] | undefined }
// > {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: async (newUser: User) => {
//       const userId = await window.electron.ipcRenderer.invoke('addNewUser', newUser)
//       const updatedUser = {
//         ...newUser,
//         id: userId
//       }
//       window.location.reload()

//       await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

//       return updatedUser
//     },
//     onMutate: (newUserInfo: User) => {
//       const previousUsers = queryClient.getQueryData<User[]>(['users'])

//       queryClient.setQueryData(['users'], (prevUsers: User[]) => {
//         if (!prevUsers) return []
//         console.log(prevUsers)

//         return [...prevUsers, newUserInfo]
//       })

//       return { previousUsers }
//     },
//     onError: (_, __, context) => {
//       if (context?.previousUsers) {
//         queryClient.setQueryData(['users'], context.previousUsers)
//       }
//     },
//     onSuccess: (updatedUser: User) => {
//       queryClient.setQueryData(['users'], (prevUsers: User[] | undefined) => {
//         if (!prevUsers) return [updatedUser]

//         const existingIndex = prevUsers.findIndex((user) => user.id === updatedUser.id)
//         if (existingIndex !== -1) {
//           prevUsers[existingIndex] = updatedUser
//           return [...prevUsers]
//         }

//         return [...prevUsers, updatedUser]
//       })
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] })
//     }
//   })
// }

//CREATE hook (post new user to api)
function useCreateUser(): UseMutationResult<void, Error, User, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      return Promise.resolve()
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(
        ['users'],
        (prevUsers: any) =>
          [
            ...prevUsers,
            {
              ...newUserInfo,
              id: (Math.random() + 1).toString(36).substring(7)
            }
          ] as User[]
      )
    }
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  })
}

//UPDATE hook (put user in api)
function useUpdateUser(): UseMutationResult<void, Error, User, void> {
  const queryClient = useQueryClient()
  return useMutation({
    // mutationFn: async (user: User) => {
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      return Promise.resolve()
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.map((prevUser: User) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      )
    }
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  })
}

//DELETE hook (delete user in api)
function useDeleteUser(): UseMutationResult<void, Error, string, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      const result = await window.electron.ipcRenderer.invoke('deleteUser', userId)
      console.log(result)

      // await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
      return Promise.resolve()
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('Enter deletion')

      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user.id !== userId)
      )
      console.log('deleted')
    }
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  })
}
export default MRT

const validateRequired = (value: string): boolean => !!value.length
const validateEmail = (email: string): false | RegExpMatchArray | null =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )

const validatePhoneNumber = (phoneNumber: number): boolean => phoneNumber.toString().length === 10 // assuming a valid phone number is 10 digits

function validateUser(user: User): {
  userId: string
  name: string
  email: string
  phoneNumber: string
} {
  return {
    userId: !validateRequired(user.userId) ? 'User ID is required' : '',
    name: !validateRequired(user.name) ? 'Name is required' : '',
    email: !validateEmail(user.email) ? 'Incorrect email format' : '',
    phoneNumber: !validatePhoneNumber(user.phoneNumber) ? 'Phone number must be 10 digits' : ''
  }
}
