import { pdbUsers } from '../../pouchdb'

const getAllUserIds = async (): Promise<string[]> => {
  try {
    // get all user data for metadata
    const result = await pdbUsers.allDocs({ include_docs: false })

    // get _id of all users
    const IdList = result.rows.filter((row) => !row.id.startsWith('_design/')).map((row) => row.id)

    return IdList
  } catch (error) {
    console.log(error)
    return []
  }
}

export default getAllUserIds
