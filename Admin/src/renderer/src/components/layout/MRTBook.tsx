import { Book } from '@renderer/store/types'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo } from 'react'

function MRTBook({ data }: { data: Book[] }): JSX.Element {
  // const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name'
        // muiEditTextFieldProps: {
        //   required: true,
        //   error: !!validationErrors?.firstName,
        //   helperText: validationErrors?.firstName,
        //   //remove any previous validation errors when Book focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       firstName: undefined
        //     })
        // }
      },
      {
        accessorKey: 'authorName',
        header: 'Author Name'
        // muiEditTextFieldProps: {
        //   required: true,
        //   error: !!validationErrors?.lastName,
        //   helperText: validationErrors?.lastName,
        //   //remove any previous validation errors when Book focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       lastName: undefined
        //     })
        // }
      }
    ],
    []
  )
  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: 'modal'
  })

  return <MaterialReactTable table={table} />
}

export default MRTBook
