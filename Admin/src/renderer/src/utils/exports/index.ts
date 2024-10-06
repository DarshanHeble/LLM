import { utils, WorkBook, WorkSheet, write } from 'xlsx'
import { saveAs } from 'file-saver'

type operation = 'Users' | 'Books' | 'users History'

// Function to export user book history to an Excel file
const exportToExcel = (flatData, type: operation): void => {
  // Create a new workbook and a worksheet from the flat data
  const workbook: WorkBook = utils.book_new()
  const worksheet: WorkSheet = utils.json_to_sheet(flatData)

  // Add the worksheet to the workbook
  utils.book_append_sheet(workbook, worksheet, 'User Book History')

  // Write the Excel file to a binary
  const excelBinary = write(workbook, { type: 'array' })

  // Create a blob and trigger download
  const blob = new Blob([excelBinary], { type: 'application/octet-stream' })
  saveAs(blob, `${type}.xlsx`)

  // Show a message to the user
  alert(
    "Please open the Excel file and select the 'barcode' column, then change the font to 'Libre Barcode 39' to see the barcodes."
  )
}

export default exportToExcel
