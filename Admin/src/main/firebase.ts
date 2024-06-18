import admin from 'firebase-admin'
import { readFile } from 'fs/promises'

async function loadServiceAccount(): Promise<string> {
  const serviceAccountData = await readFile('./serviceAccountKey.json', 'utf-8')
  return JSON.parse(serviceAccountData)
}

const serviceAccount = await loadServiceAccount()
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
export default db
