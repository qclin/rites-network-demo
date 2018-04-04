import firebase from './firebase'


export function signInAnonymously(){
  firebase.auth().signInAnonymously().catch(function(error) {
    if(error){
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // #* wildcard consider creating a temp ID here
    }
  });
}



// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       uid = user.uid;
//     } else {
//       // User is signed out.
//     }
// });
