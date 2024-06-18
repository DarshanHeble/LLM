import { User, usStates } from '@renderer/store/types'
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
        accessorKey: 'firstName',
        header: 'First Name'
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
        accessorKey: 'lastName',
        header: 'Last Name'
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
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        editSelectOptions: usStates
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
    editDisplayMode: 'modal'
  })

  return <MaterialReactTable table={table} />
}

export default MRT
