// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


// https://github.com/firebase/reactfire#using-the-firebase-js-sdk-in-react
// Initalize and export Firebase.
const config = {
  apiKey: "AIzaSyBK2so_44YSVJnVw1-Nx7XucjubVVo__c4",
  authDomain: "rites-demo-dev.firebaseapp.com",
  databaseURL: "https://rites-demo-dev.firebaseio.com",
  projectId: "rites-demo-dev",
  storageBucket: "",
  messagingSenderId: "137905767735"
};

export default firebase.initializeApp(config);
