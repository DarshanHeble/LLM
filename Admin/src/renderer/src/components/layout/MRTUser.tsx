import { User } from '@renderer/store/types'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'

function MRT({ data }: { data: User[] }): JSX.Element {
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
        accessorKey: 'name',
        header: 'Name'
        // muiEditTextFieldProps: {
        //   required: true,
        //   error: !!validationErrors?.firstName,
        //   helperText: validationErrors?.firstName,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       firstName: undefined
        //     })
        // }
      },
      {
        accessorKey: 'password',
        header: 'password'
        // muiEditTextFieldProps: {
        //   required: true,
        //   error: !!validationErrors?.lastName,
        //   helperText: validationErrors?.lastName,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       lastName: undefined
        //     })
        // }
      },
      {
        accessorKey: 'email',
        header: 'Email'
        // muiEditTextFieldProps: {
        //   type: 'email',
        //   required: true,
        //   error: !!validationErrors?.email,
        //   helperText: validationErrors?.email,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       email: undefined
        //     })
        // }
      },
      {
        accessorKey: 'phoneNumber',
        header: 'number'
        // editVariant: 'select',
        // editSelectOptions: usStates
        // muiEditTextFieldProps: {
        //   select: true,
        //   error: !!validationErrors?.state,
        //   helperText: validationErrors?.state
        // }
      }
    ],
    [validationErrors]
  )
  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: 'row',
    muiSkeletonProps: {
      animation: 'wave'
    },
    muiLinearProgressProps: {
      color: 'secondary'
    },
    muiCircularProgressProps: {
      color: 'secondary'
    },
    state: {
      isLoading: true
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRT
