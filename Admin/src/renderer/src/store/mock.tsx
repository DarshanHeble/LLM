// import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import BookIcon from '@mui/icons-material/Book'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'

interface adminType {
  name?: string
  hashedPassword?: string
  email?: string
  phoneNumber?: string
}

type sidebarDataType = {
  name: string
  icon: JSX.Element
  route: string
  active: boolean
}
export const sidebarData: sidebarDataType[] = [
  {
    name: 'Dashboard',
    icon: <DashboardIcon />,
    route: '/dashboard',
    active: true
  },
  {
    name: 'Manage Books',
    icon: <LibraryBooksIcon />,
    route: '/manageBooks',
    active: false
  },
  {
    name: 'Manage Users',
    icon: <PersonIcon />,
    route: '/manageUsers',
    active: false
  },
  {
    name: 'Issue Book',
    icon: <BookmarkAddIcon />,
    route: '/issueBook',
    active: false
  },
  {
    name: 'View Issued Books',
    icon: <BookIcon />,
    route: '/viewIssuedBooks',
    active: false
  },
  {
    name: 'Return Books',
    icon: <ShoppingCartCheckoutIcon />,
    route: '/returnBooks',
    active: false
  }
]

export const adminAccountData: adminType = {}
