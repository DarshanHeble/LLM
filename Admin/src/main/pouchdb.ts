import { PdbAdminPath, PdbResourcesPath, PdbUsersPath, projectDirPath } from '@shared/constants'
import { existsSync, mkdirSync } from 'fs'
import PouchDB from 'pouchdb'

if (!existsSync(projectDirPath)) {
  mkdirSync(projectDirPath)
}

export const pdbAdmin = new PouchDB(PdbAdminPath)
export const pdbUsers = new PouchDB(PdbUsersPath)
export const pdbResources = new PouchDB(PdbResourcesPath)
