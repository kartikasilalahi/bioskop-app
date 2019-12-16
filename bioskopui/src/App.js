import React, { Component } from 'react';
import './App.css';
import Home from './pages/Home'
import {Switch, Route} from 'react-router-dom'
import ManageAdmin from './pages/manageadmin'
import Header from './components/Header'
import {connect} from 'react-redux'
import Axios from 'axios'
import {APIURL} from './support/APiUrl'
import {LoginSuccessAction} from './redux/action'
import Moviedetail from './pages/movie-detail';
import Belitiket from './pages/Belitiket'
import Lamanlogin from './pages/lamanlogin';
import Register from './pages/register';
import Cart from './pages/cart'
import SettingAccount from './pages/setting';
import Notfound from './pages/notfound'



class App extends Component {
  state={
    loading:true
  }

  componentDidMount(){
    var id=localStorage.getItem('ini-key')
    Axios.get(`${APIURL}users/${id}`)
    .then((res)=>{
      this.props.LoginSuccessAction(res.data)
    }).catch((err)=>{
      console.log(err)
    })
    .finally(()=>{
      this.setState({loading:false})
    })
  }

  render(){
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return (
      <div className="App">
        <Header/>
        
        <Switch>
          <Route exact path={'/'} > <Home/> </Route>
          <Route exact path={'/manageadmin'} ><ManageAdmin/> </Route>
          <Route exact path='/moviedetail/:id' component={Moviedetail}/>
          <Route exact path='/belitiket' component={Belitiket}/>
          <Route exact path='/lamanlogin' component={Lamanlogin}/>
          <Route exact path='/register' component={Register}/>
          <Route exact path='/cart' component={Cart}/>
          <Route exact path='/setting' component={SettingAccount}/>
          <Route exact path='/notfound' component={Notfound}/>



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
