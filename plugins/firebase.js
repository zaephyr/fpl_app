import * as firebase from 'firebase'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: 'fpl-live-818e6',
  storageBucket: process.env.FIREBASE_STORAGE,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER,
  appId: process.env.FIREBASE_APP_ID,
}
// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : ''

export const auth = firebase.auth()
export default firebase
