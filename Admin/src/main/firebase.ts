import admin from 'firebase-admin'
import ser from './creds.json'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: ser.project_id,
    privateKey: ser.private_key,
    clientEmail: ser.client_email
  })
})

const db = admin.firestore()
export default db
