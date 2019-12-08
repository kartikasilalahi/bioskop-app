import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home'
import {Switch, Route} from 'react-router-dom'
import ManageAdmin from './pages/manageadmin'
import LamanLogin from './components/LamanLogin'

function App() {
  return (
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path={'/'} > <Home/> </Route>
        <Route exact path={'/manageadmin'}><ManageAdmin/> </Route>
        <Route exact path={'/LamanLogin'}><LamanLogin/></Route>
      </Switch>
    </div>
  );
}

export default App;
