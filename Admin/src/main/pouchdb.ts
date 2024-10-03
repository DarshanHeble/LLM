import {
  PdbAdminPath,
  PdbOthersPath,
  PdbResourcesPath,
  PdbUserHistoryPath,
  PdbUsersPath,
  projectDirPath
} from '@shared/constants'
import { existsSync, mkdirSync } from 'fs'
import PouchDB from 'pouchdb'

if (!existsSync(projectDirPath)) {
  mkdirSync(projectDirPath)
}
console.log(projectDirPath)

export const pdbAdmin = new PouchDB(PdbAdminPath)
export const pdbUsers = new PouchDB(PdbUsersPath)
export const pdbResources = new PouchDB(PdbResourcesPath)
export const pdbOthers = new PouchDB(PdbOthersPath)
export const pdbUserHistory = new PouchDB(PdbUserHistoryPath)
