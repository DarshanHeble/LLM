import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { UserHistory } from '@shared/types/types'

interface Props {
  data: UserHistory
}

const tableHeadings = [
  '#',
  'Book Id',
  'Book Name',
  'Author Name',
  'Course',
  'Sem',
  'Issue Date',
  'Due Date',
  'Returned Date',
  'Fine'
]

function HistoryDetailPanel(props: Props): JSX.Element {
  const { data } = props

  return (
    <TableContainer>
      <Table sx={{ border: '5px solid #121212' }}>
        <TableHead sx={{ bgcolor: '#121212' }}>
          <TableRow>
            {tableHeadings.map((head, index) => (
              <TableCell key={index}>{head} </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.bookHistory?.map((book, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.bookName}</TableCell>
              <TableCell>{book.authorName}</TableCell>
              <TableCell>{book.course}</TableCell>
              <TableCell>{book.sem}</TableCell>
              <TableCell>{book.issueDate}</TableCell>
              <TableCell>{book.dueDate}</TableCell>
              <TableCell>{book.returnedDate}</TableCell>
              <TableCell>{book.fine}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default HistoryDetailPanel
