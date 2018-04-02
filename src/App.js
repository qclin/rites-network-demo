import React, { Component } from 'react';
import Unity from "react-unity-webgl";
import { UnityEvent, RegisterExternalListener } from "react-unity-webgl";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from './scripts/firebase'
//components
import Header from './components/headerComponent/header';
import Footer from './components/footerComponent/footer';
import HomePage from './components/pages/homePage';
import Projects from './components/pages/projects';
import Contact from './components/pages/contact';

//includes
import './Assets/css/default.min.css';


class App extends React.Component {


  constructor() {
    super()
    this.state = {
      inputValue: '',
      clickData: {},
      tagData: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.logToFire = this.logToFire.bind(this);

    this.spawnEnemies = new UnityEvent("SpawnBehaviour", "SpawnEnemies");

    // emit to unity here
    this.loadData = new UnityEvent("ReactManagerObject", "LoadData");
    // unity will ping this
    RegisterExternalListener('SaveData', this.postToFirebase.bind(this));

  }


  componentWillMount(){
    // firebase.auth().signInAnonymously().catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
  }
  componentDidMount() {
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
    this.clickDataRef = firebase.database().ref('/clickData');
    this.clickDataCallback = this.clickDataRef.on('value', (snap) => {
      this.setState({ clickData: snap.val() }); // ******** can also store data in PROP
    });

    this.tagDataRef = firebase.database().ref('/tagData');

    // here need to push a new role with ANONYMOUS AUTH ID

    this.tagDataCallback = this.tagDataRef.on('value', (snap) => {
      this.setState({ tagData: snap.val() }); // ******** can also store data in PROP
    });
  }

  // // FROM sections see: https://reactjs.org/docs/forms.html
  // handleChange(event) {
  //   console.log("handleChange ----- ", event.target.value);
  //   this.setState({inputValue: event.target.value});
  // }


  onProgress (progression) {
    console.log (`Loading ${(progression * 100)} % ...`)
    if (progression === 1)
      console.log (`Loading done!`)
  }

  onClickSpawnEnemies(count) {
    if (this.spawnEnemies.canEmit() === true) this.spawnEnemies.emit(count);
  }

  // save function for listerner
  postToFirebase(tags){
    var payload = tags.split('|');
    // positionX| postionY| positionZ| tag1| tag2| tag3

    var positionX = payload[0];
    var positionY = payload[1];
    var positionZ = payload[2];

    var tags = payload.splice(3,-1);

    console.log(positionX, positionY, positionZ, tags);
    this.tagDataRef.push({
        timestamp: "test test"
    });
  }
  logToFire(event){
    event.preventDefault();
    const name = event.target[0].value;
    console.log('nammmmme :', name);

    var timestamp = new Date().toString();

    this.clickDataRef.push({
        timestamp: "test test"
    })
  }
  // TODO: need dummy data until firebase fetch loads
  // {this.state.clickData.map(function(listValue){
  //   return <li>{listValue}</li>;
  // })}
  render() {

    return (
      <div>
      <form onSubmit={this.logToFire.bind(this)}>
        <input type="text"
          placeholder="Name this"
          value={this.state.inputValue}
          ref="nameStringInput"
          onChange={this.handleChange}/>
        <button type="submit"> submit </button>
      </form>
      <div onClick={this.onClickSpawnEnemies.bind(this, 5)}>
        Click to Spawn 5 Enemies
      </div>


      <Unity src='Build/whiteboard01.json' loader='Build/UnityLoader.js'
      onProgress={ this.onProgress } />
      </div>
    );
  }


  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    this.clickDataRef.off('value', this.clickDataCallback);
  }

}

export default App;