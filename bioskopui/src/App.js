import React, { Component } from 'react';
import './App.css';
import Home from './pages/Home'
import {Switch, Route} from 'react-router-dom'
import ManageAdmin from './pages/manageadmin'
import Header from './components/Header'
import {connect} from 'react-redux'
import Axios from 'axios'
import {APIURL} from './support/APiUrl'
import {LoginSuccessAction, CartAction} from './redux/action'
import Moviedetail from './pages/movie-detail';
import Belitiket from './pages/Belitiket'
import Lamanlogin from './pages/lamanlogin';
import Register from './pages/register';
import Cart from './pages/cart'
import SettingAccount from './pages/setting';
import Notfound from './pages/notfound'
import Managestudio from './pages/managestudio'
import History from './pages/history'


class App extends Component {
  state={
    loading:true,
    datacart:[]
  }

  componentDidMount(){
    var id=localStorage.getItem('ini-key')
    Axios.get(`${APIURL}users/${id}`)
    .then((res)=>{
      this.props.LoginSuccessAction(res.data)

      Axios.get(`${APIURL}orders?_expand=movie&userId=${id}&bayar=false`)
      .then(res1=>{
        var datacart=res1.data
        this.setState({datacart:datacart,loading:false})
        this.props.CartAction(this.state.datacart.length)
      })
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
    // if (this.props.AuthLogin) {
    //     Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=false`)
    //     .then(res1=>{
    //       // var datacart=res1.data
    //       this.props.CartAction(this.state.datacart.length)
    //       // console.log(this.state.datacart)
    //       // console.log('ini di render', this.props.Cart)
    //   }).catch(err=>{
    //     console.log(err)
    //   })
    // }

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
          <Route exact path='/managestudio' component={Managestudio}/>
          <Route exact path='/history' component={History}/>
        </Switch>
      </div>
    );
  }
}

const MapstateToprops=(state)=>{
  return{
      AuthLogin:state.Auth.login,
      Userid:state.Auth.id,
      Cart:state.Cart.cart,
      totalharga:state.Cart.totalharga,
      
  }
}

export default connect(MapstateToprops,{LoginSuccessAction, CartAction})(App);
