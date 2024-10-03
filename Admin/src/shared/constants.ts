import { app } from 'electron'
import path from 'path'

export const FINE_AMOUNT = 20

export const BOOK_COUNTER_ID = 'book_counter'
export const USER_COUNTER_ID = 'user_counter'

export const ADMIN_ID = '###admin@000'

export const appDirName = 'Library Management System'
export const pAdmin = 'Admin'
export const pUsers = 'Users'
export const pResources = 'Resources'
export const pOthers = 'Others'
export const pUserHistory = 'User History'

export const userDataPath = app.getPath('userData')

export const projectDirPath = path.join(userDataPath, appDirName)

export const PdbAdminPath = path.join(projectDirPath, pAdmin)
export const PdbUsersPath = path.join(projectDirPath, pUsers)
export const PdbResourcesPath = path.join(projectDirPath, pResources)
export const PdbOthersPath = path.join(projectDirPath, pOthers)
export const PdbUserHistoryPath = path.join(projectDirPath, pUserHistory)
