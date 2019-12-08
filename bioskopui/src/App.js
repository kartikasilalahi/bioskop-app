import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home'
import {Switch, Route} from 'react-router-dom'
import ManageAdmin from './pages/manageadmin'


function App() {
  return (
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path={'/'} > <Home/> </Route>
        <Route exact path={'/manageadmin'}><ManageAdmin/> </Route>
      </Switch>
    </div>
  );
}

export default App;
