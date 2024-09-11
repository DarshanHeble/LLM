import { pdbResources } from '../../pouchdb'

const deleteOneBook = async (_id: string): Promise<boolean> => {
  try {
    await pdbResources.get(_id).then((doc) => {
      return pdbResources.remove(doc)
    })
    console.log('Successfully removed One Book')

    return true
  } catch (error) {
    console.error('Error Deleting Book', error)
    return false
  }
}
export default deleteOneBook
