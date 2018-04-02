import React, { Component } from 'react';
import Unity from "react-unity-webgl";
import { UnityEvent } from "react-unity-webgl";
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
      clickData: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.logToFire = this.logToFire.bind(this);

    this.spawnEnemies = new UnityEvent("SpawnBehaviour", "SpawnEnemies");
  }

  componentDidMount() {
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
    this.clickDataRef = firebase.database().ref('/clickData');
    this.clickDataCallback = this.clickDataRef.on('value', (snap) => {
      console.log("snapval ---- ", snap.val());
      this.setState({ clickData: snap.val() }); // ******** can also store data in PROP
      console.log("clickData ---- ", this.state.clickData)
    });
  }

  // FROM sections see: https://reactjs.org/docs/forms.html
  handleChange(event) {
    console.log("handleChange ----- ", event.target.value);
    this.setState({inputValue: event.target.value});
  }


  onProgress (progression) {
    console.log (`Loading ${(progression * 100)} % ...`)
    if (progression === 1)
      console.log (`Loading done!`)
  }

  onClickSpawnEnemies(count) {
    if (this.spawnEnemies.canEmit() === true) this.spawnEnemies.emit(count);
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
      <ul>

      </ul>
      <input type="text" placeholder="round two"/>
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


      <Unity src='Build/spawntest.json' loader='Build/UnityLoader.js'
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
