import { app } from 'electron'
import path from 'path'

export const appDirName = 'Library Management System'
export const pAdmin = 'Admin'
export const pUsers = 'Users'
export const pResources = 'Resources'

export const userDataPath = app.getPath('userData')

export const projectDirPath = path.join(userDataPath, appDirName)

export const PdbAdminPath = path.join(projectDirPath, pAdmin)
export const PdbUsersPath = path.join(projectDirPath, pUsers)
export const PdbResourcesPath = path.join(projectDirPath, pResources)
