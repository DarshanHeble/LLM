import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import BookIcon from '@mui/icons-material/Book'

interface adminType {
  name?: string
  hashedPassword?: string
  email?: string
  phoneNumber?: string
}

export const sidebarData = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    route: '/home'
  },
  {
    name: 'Manage Books',
    icon: <LibraryBooksIcon />,
    route: '/manageBooks'
  },
  {
    name: 'Manage Students',
    icon: <PersonIcon />,
    route: '/manageStudents'
  },
  {
    name: 'View Issued Books',
    icon: <BookIcon />,
    route: '/viewIssuedBooks'
  },
  {
    name: 'Return Books',
    icon: <ShoppingCartCheckoutIcon />,
    route: '/returnBooks'
  }
]

export const adminAccountData: adminType = {}
