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

export const data = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    route: '/home'
  },
  {
    name: 'Manage Books',
    icon: <LibraryBooksIcon />,
    route: '/managebooks'
  },
  {
    name: 'Manage Students',
    icon: <PersonIcon />,
    route: '/managestudents'
  },
  {
    name: 'View Issued Books',
    icon: <BookIcon />,
    route: '/viewissuedbooks'
  },
  {
    name: 'Return Books',
    icon: <ShoppingCartCheckoutIcon />,
    route: '/returnbooks'
  }
]

export const adminAccountData: adminType = {}
