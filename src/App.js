import React, { Component } from 'react';
import Unity from "react-unity-webgl";
import { UnityEvent, RegisterExternalListener } from "react-unity-webgl";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from './scripts/firebase'
import { signInAnonymously } from './scripts/auth'

//components
// import Header from './components/headerComponent/header';
// import Footer from './components/footerComponent/footer';
// import HomePage from './components/pages/homePage';
// import Projects from './components/pages/projects';
// import Contact from './components/pages/contact';
//includes
import './Assets/css/default.min.css';


class App extends React.Component {

  constructor() {
    super()
    this.state = {
      inputValue: '',
      clickData: {},
      tagData: {},
      unityisLoaded: false
    };
    this.spawnEnemies = new UnityEvent("SpawnBehaviour", "SpawnEnemies");

    // emit to unity here
    this.loadData = new UnityEvent("ReactManagerObject", "LoadData");
    // unity will ping this
    RegisterExternalListener('SaveData', this.postToFirebase.bind(this));

  }


  componentWillMount(){
    signInAnonymously();
    var $this = this; // shallow copy to reference this inside firebase function
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $this.createUserEntry(user.uid);
      }else{
        //not signed in
      }
    });
  }

  createUserEntry(userID){
    this.setState({userID});
    //#1 create session ref from the authID
    this.userRef = firebase.database().ref(`/tagData/${userID}`);
    this.userRef.on('value', (snap) => {
      const userData = snap.val();
      //future-proof, check if user already have an entry before overriding the row
      if(!userData){
        //#2 initialize child with ANONYMOUS AUTH ID & timestamp
        var timestamp = new Date().toString();
        firebase.database().ref('/tagData').child(userID).set({timestamp});
      }else{
        console.log('user exists in database, continue ', userData);
      }
    });
    console.log("createUserEntry: tagData : userID :",  userID);
  }



  componentDidMount() {
    var $this = this;
    this.tagDataRef = firebase.database().ref('/tagData');
    // can increase this to last 100, once we test 5 is reached
    this.tagDataCallback = this.tagDataRef.limitToLast(5).on('value', (snap) => {
      var payload = snap.val();
      console.log("tagData:   ", typeof payload, payload);
      // # TODO: emit all to Unity, array of dictionaries?
      const userArray = Object.keys(payload);
      userArray.forEach(function(user, index){
        console.log("0000::: ", user, payload[user]);
        var userPayload = payload[user];
        var entries = Object.keys(userPayload).map(i => {
          if(i != 'timestamp'){
            return userPayload[i]
          }
        });

        entries.forEach(function(entry, index, arr){
          if(entry){
            var parameterArr = Object.keys(entry).reduce(function(res, v) {
                // console.log("2222 :::: ", entry[v])
                return res.concat(entry[v]);
            }, []);
            console.log("33333 :::: ", parameterArr);
            parameterArr.unshift($this.state.userID);
            var parameterString = parameterArr.join('|');
            console.log("444444 :::: ", parameterString);
            // READY TO EMIT !
            $this.sendToUnity(parameterString);
          }
        });
      });
    });
  }

  sendToUnity(payload){
    console.log(":::::::: sendToUnity", payload )
    if(this.loadData.canEmit() && this.unityisLoaded) this.loadData.emit(payload); // this is throwing error,
  }

  onProgress (progression) {
    console.log (`Loading ${(progression * 100)} % ...`)
    if (progression === 1){
      // perhaps need to move the emitting inside when progression is at 100 %
      console.log (`Loading done!`)
      this.setState({unityisLoaded: true})
    }
  }

  // save function for listerner
  postToFirebase(tags){
    console.log("postToFirebase", tags)
    var payload = tags.split('|');
    // positionX| postionY| positionZ| tag1| tag2| tag3
    var positionX = payload[0];
    var positionY = payload[1];
    var positionZ = payload[2];
    var tagString = payload.slice(3,-1);
    console.log(positionX, positionY, positionZ, tagString);
    // #3 change to sessionref path
    var newPostRef = this.userRef.push();
    newPostRef.set({
      positionX, positionY, positionZ, tagString
    });
  }

  render() {
    return (
      <div>
      <Unity src='Build/wb009_low5.json' loader='Build/UnityLoader.js'
      onProgress={ this.onProgress.bind(this) } />
      </div>
    );
  }


  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    this.clickDataRef.off('value', this.clickDataCallback);

    // TODO: need to signout user,
  }

}

export default App;
