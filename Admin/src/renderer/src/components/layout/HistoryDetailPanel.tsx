import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { User } from '@renderer/store/fake'

interface Props {
  data: User
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

const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function HistoryDetailPanel(props: Props): JSX.Element {
  const { data } = props

  function formateDate(date: Date): string {
    const currentDay = day[date.getDay()]
    const currentMonth = month[date.getMonth()]
    const currentDate = date.getDate()
    const year = date.getFullYear()
    const time = `${date.getHours()}:${date.getMinutes()} `
    return `${currentDay} ${currentMonth} ${currentDate} ${year} ${time}`
  }
  formateDate(new Date())

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
              <TableCell>{formateDate(book.issueDate)}</TableCell>
              <TableCell>{formateDate(book.dueDate)}</TableCell>
              <TableCell>{formateDate(book.returnedDate)}</TableCell>
              <TableCell>{book.fine}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default HistoryDetailPanel
