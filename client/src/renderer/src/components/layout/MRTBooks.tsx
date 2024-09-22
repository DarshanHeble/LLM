import { Book } from '@shared/types/types'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'

function MRTBooks(): JSX.Element {
  const [books, setBooks] = useState<Book[]>([])
  useEffect(() => {
    getBookData()
  }, [])

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: '_id',
        header: ' ID',
        enableHiding: false
      }
    ],
    []
  )
  const table = useMaterialReactTable({ columns, books })

  const getBookData = (): void => {
    window.electron.ipcRenderer.invoke('getBookData').then((re) => {
      console.log('book Data', re)
    })
  }

  return <MaterialReactTable table={table} />
}

export default MRTBooks
