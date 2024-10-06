import { User } from '@shared/types/types'

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

export const semList: string[] = ['1', '2', '3', '4', '5', '6']
export const courseList: string[] = ['BCA', 'BBA', 'BA', 'BCOM']

export const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const monthList = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
