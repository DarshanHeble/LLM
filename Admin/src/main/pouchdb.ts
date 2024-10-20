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
import PouchDbFind from 'pouchdb-find'

PouchDB.plugin(PouchDbFind)

if (!existsSync(projectDirPath)) {
  mkdirSync(projectDirPath)
}
console.log(projectDirPath)

export const pdbAdmin = new PouchDB(PdbAdminPath)
export const pdbUsers = new PouchDB(PdbUsersPath)
export const pdbResources = new PouchDB(PdbResourcesPath)
export const pdbOthers = new PouchDB(PdbOthersPath)
export const pdbUserHistory = new PouchDB(PdbUserHistoryPath)

// Function to create an index on the 'requestedBooks.bookId' field in the 'pdbUsers' database
const createUserBookRequestIndex = async (): Promise<void> => {
  try {
    const result = await pdbUsers.createIndex({
      index: {
        fields: ['requestedBooks._id'] // Create an index for fast querying on 'bookId' in requestedBooks
      }
    })
    console.log('Index created on requestedBooks.bookId:', result)
  } catch (error) {
    console.error('Error creating index:', error)
  }
}

createUserBookRequestIndex()
