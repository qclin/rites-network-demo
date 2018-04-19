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
    RegisterExternalListener('MarkovTest', this.predictText.bind(this));

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
    this.userRef.once('value', (snap) => {
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

  }

  triggerLoadData(){
    var $this = this;
    this.tagDataRef = firebase.database().ref('/tagData');
    // can increase this to last 100, once we test 5 is reached
    this.tagDataCallback = this.tagDataRef.limitToLast(100).once('value', (snap) => {
      var payload = snap.val();
      // # TODO: emit all to Unity, array of dictionaries?
      const userArray = Object.keys(payload);
      userArray.forEach(function(user, index){
        var userPayload = payload[user];
        var entries = Object.keys(userPayload).map(i => {
          if(i != 'timestamp'){
            return userPayload[i]
          }
        });
        entries.forEach(function(entry, index, arr){
          if(entry){
            $this.sendToUnity(entry);
          }
        });
      });
    });

  }
  sendToUnity(entry){
    // PARSE
    var parameterArr = Object.keys(entry).reduce(function(res, v) {
        return res.concat(entry[v]);
    }, []);
    parameterArr.unshift(this.state.userID);
    var payload = parameterArr.join('|');
    // console.log(":::::::: sendToUnity", this.state.unityisLoaded, payload);
    if(this.loadData.canEmit() && this.state.unityisLoaded) this.loadData.emit(payload); // this is throwing error,
  }

  onProgress (progression) {
    console.log (`Loading ${(progression * 100)} % ...`)
    if (progression === 1){
      // perhaps need to move the emitting inside when progression is at 100 %
      console.log (`Loading done!`)
      this.setState({unityisLoaded: true})
      this.triggerLoadData()
    }
  }
  // calls markov
  predictText(payload){
    var dummy = "1|dog|eat|red"
    fetch(`http://localhost:4000/markov/${dummy}`).then((response) => {
      console.log("Inside Fetch : ", response)
    })
    console.log('PREDICT PREDICT')
  }
  // save function for listerner
  postToFirebase(payload){
    console.log("postToFirebase", payload)
    var tags = payload.split('|');
    // positionX| postionY| positionZ| tag1| tag2| tag3
    var positionX = tags[0];
    var positionY = tags[1];
    var positionZ = tags[2];
    var tagString = tags.slice(3,-1);
    // #3 change to sessionref path
    var newPostRef = this.userRef.push();
    newPostRef.set({
      positionX, positionY, positionZ, tagString
    });
  }

  render() {
    return (
      <div>
      <button onClick={this.predictText}> predict predict </button>
      <Unity src='Build/brbuld.json' loader='Build/UnityLoader.js'
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
