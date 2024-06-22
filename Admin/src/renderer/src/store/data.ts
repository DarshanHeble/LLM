import { Book, User } from './types'

export const BookData: Book[] = [
  { id: '0', bookName: 'bookname', authorName: 'john' },
  { id: '1', bookName: 'bookname', authorName: 'john' },
  { id: '2', bookName: 'bookname', authorName: 'john' }
]

export const Mode = 'light'

// TODO:
export const loadUserData = (): User[] => {
  let data: User[] = []
  window.electron.ipcRenderer.invoke('getUserData', '').then((re) => {
    data = re
    return re
    // console.log('funtion', data)
  })

  return data
}

export const fakeData: User[] = [
  {
    id: '9s41rp',
    name: 'Kelvin',
    password: 'Langosh',
    email: 'Jerod14@hotmail.com',
    phoneNumber: 90909090
  },
  {
    id: '08m6rx',
    name: 'Molly',
    password: 'Purdy',
    email: 'Hugh.Dach79@hotmail.com',
    phoneNumber: 9990999999
  },
  {
    id: '5ymtrc',
    name: 'Henry',
    password: 'Lynch',
    email: 'Camden.Macejkovic@yahoo.com',
    phoneNumber: 9990999999
  },
  {
    id: 'ek5b97',
    name: 'Glenda',
    password: 'Douglas',
    email: 'Eric0@yahoo.com',
    phoneNumber: 9990999999
  },
  {
    id: 'xxtydd',
    name: 'Leone',
    password: 'Williamson',
    email: 'Ericka_Mueller52@yahoo.com',
    phoneNumber: 9990999999
  },
  {
    id: 'wzxj9m',
    name: 'Mckenna',
    password: 'Friesen',
    email: 'Veda_Feeney@yahoo.com',
    phoneNumber: 9990999999
  },
  {
    id: '21dwtz',
    name: 'Wyman',
    password: 'Jast',
    email: 'Melvin.Pacocha@yahoo.com',
    phoneNumber: 9990999999
  },
  {
    id: 'o8oe4k',
    name: 'Janick',
    password: 'Willms',
    email: 'Delfina12@gmail.com',
    phoneNumber: 9990999999
  }
]

// export const adminLoginInfo = window.electron.ipcRenderer.invoke('getAdminData')
