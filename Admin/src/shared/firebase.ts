// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBIIZVYKonUzLRNX7eJY8hKybQqrVfF5XA',
  authDomain: 'llms-f9057.firebaseapp.com',
  projectId: 'llms-f9057',
  storageBucket: 'llms-f9057.appspot.com',
  messagingSenderId: '232495300911',
  appId: '1:232495300911:web:8083fc8a855d18ffa561da',
  measurementId: 'G-PEM4ZB86QP'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export default getFirestore()
