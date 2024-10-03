// import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LibraryBooksBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'

import PersonIcon from '@mui/icons-material/Person'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'

import BookIcon from '@mui/icons-material/Book'
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'

import HistoryIcon from '@mui/icons-material/History'
// import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
// import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined'

interface adminType {
  name?: string
  hashedPassword?: string
  email?: string
  phoneNumber?: string
}

type sidebarDataType = {
  name: string
  filledIcon: JSX.Element
  outlinedIcon: JSX.Element
  route: string
}
export const topSidebarData: sidebarDataType[] = [
  {
    name: 'Dashboard',
    filledIcon: <DashboardIcon />,
    outlinedIcon: <DashboardOutlinedIcon />,
    route: '/dashboard'
  },
  {
    name: 'Manage Books',
    filledIcon: <LibraryBooksIcon />,
    outlinedIcon: <LibraryBooksBooksOutlinedIcon />,
    route: '/manageBooks'
  },
  {
    name: 'Manage Users',
    filledIcon: <PersonIcon />,
    outlinedIcon: <PersonOutlinedIcon />,
    route: '/manageUsers'
  },
  {
    name: 'Issue Book',
    filledIcon: <BookmarkAddIcon />,
    outlinedIcon: <BookmarkAddOutlinedIcon />,
    route: '/issueBook'
  },
  {
    name: 'View Issued Books',
    filledIcon: <BookIcon />,
    outlinedIcon: <BookOutlinedIcon />,
    route: '/viewIssuedBooks'
  },
  {
    name: 'Return Books',
    filledIcon: <AssignmentReturnIcon />,
    outlinedIcon: <AssignmentReturnOutlinedIcon />,
    route: '/returnBooks'
  },
  {
    name: 'History',
    filledIcon: <HistoryIcon />,
    outlinedIcon: <HistoryIcon />,
    route: '/userHistory'
  }
]

export const adminAccountData: adminType = {}

export const drawerSize: number = 240
