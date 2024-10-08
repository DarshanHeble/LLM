/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book } from '@shared/types/types'
import { dialog } from 'electron'
import * as xlsx from 'xlsx'
import fs from 'fs'

// Required columns for the book data
const requiredColumns = ['Book Name', 'Author Name', 'Course', 'Semester', 'Quantity']

//  Opens a file dialog and returns the selected file path
const selectExcelFile = async (): Promise<string> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    title: 'Select an Excel File',
    filters: [{ name: 'Excel File', extensions: ['csv', 'xlsx'] }]
  })

  if (canceled || filePaths.length === 0) {
    throw new Error('No file selected')
    // return "No file selected"
  }

  return filePaths[0] // Return the first selected file path
}

//  Reads and loads the selected Excel or CSV file into a workbook
const loadWorkbookFromFile = (filePath: string): xlsx.WorkBook => {
  const fileBuffer = fs.readFileSync(filePath)
  return xlsx.read(fileBuffer, { type: 'buffer' }) // Read the file into a workbook
}

//  Converts the first sheet of the workbook into JSON data
const extractDataFromWorkbook = (workbook: xlsx.WorkBook): Record<string, any>[] => {
  const sheetName = workbook.SheetNames[0] // Get the first sheet name
  const worksheet = workbook.Sheets[sheetName] // Access the first sheet
  return xlsx.utils.sheet_to_json(worksheet) // Convert sheet to JSON
}

//  Validates that the file contains the required columns
const validateColumns = (jsonData: Record<string, any>[]): void => {
  if (jsonData.length === 0) {
    throw new Error('The file is empty')
  }

  const fileColumns = Object.keys(jsonData[0]) // Get column names from the first row
  const missingColumns = requiredColumns.filter((col) => !fileColumns.includes(col))

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`)
  }
}

//  Maps the raw JSON data to the `Book` type
const mapDataToBooks = (jsonData: Record<string, any>[]): Book[] => {
  return jsonData.map((row) => ({
    bookName: row['Book Name'],
    authorName: row['Author Name'],
    sem: Number(row['Semester']),
    quantity: Number(row['Quantity']),
    course: row['Course'],
    addedAt: new Date(),
    _id: ''
  }))
}

//  Main function to get book data from the selected Excel or CSV file
const getBookDataFromExcel = async (): Promise<Book[]> => {
  try {
    const filePath = await selectExcelFile()

    const workbook = loadWorkbookFromFile(filePath)

    const jsonData = extractDataFromWorkbook(workbook)

    validateColumns(jsonData)
    const data = mapDataToBooks(jsonData)
    console.log('data', data)

    return data
  } catch (error) {
    console.error('Error loading book data:', error)
    throw error
  }
}

export default getBookDataFromExcel
