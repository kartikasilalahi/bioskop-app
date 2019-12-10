import React, { Component } from 'react';
import './App.css';
import Home from './pages/Home'
import {Switch, Route} from 'react-router-dom'
import ManageAdmin from './pages/manageadmin'
import Header from './components/Header'
import {connect} from 'react-redux'
import {} from './redux/action'
import Axios from 'axios'
import {APIURL} from './support/APiUrl'
import {LoginSuccessAction} from './redux/action'
import Moviedetail from './pages/movie-detail';

class App extends Component {
  state={
    loading:true
  }

  componentDidMount(){
    var id=localStorage.getItem('ini-key')
    Axios.get(`${APIURL}users/${id}`)
    .then((res)=>{
      this.props.LoginSuccessAction(res.data)
      this.setState({loading:false})
    }).catch((err)=>{
      console.log(err)
    })
  }

  render(){
    return (
      <div className="App">
        <Header/>
        
        <Switch>
          <Route exact path={'/'} > <Home/> </Route>
          <Route exact path={'/manageadmin'} ><ManageAdmin/> </Route>
          <Route exact path='/moviedetail/:id' component={Moviedetail}/>
        </Switch>
      </div>
    );
  }
}

const MapstateToprops=(state)=>{
  return{
      AuthLogin:state.Auth.login
  }
}

export default connect(MapstateToprops,{LoginSuccessAction})(App);
