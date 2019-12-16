import React, { Component } from 'react';
import {Link,Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
// import Axios from 'axios';
// import {APIURL} from '../support/APiUrl'
import {connect} from 'react-redux'
import {LoginSuccessAction, Loginthunk, Login_error} from '../redux/action'
import {Form, Button} from 'react-bootstrap'
import Swal from 'sweetalert2'

class Lamanlogin extends Component {
    state = {  
        error:'',
        loading:false
    }

    onLoginClick = () => {
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        // if ((username === '' &&  password === '') || username === '' || password === '' ) {
        //     this.setState({error: "Belum terisi!"})
        //     Swal.fire({
        //         icon: "warning",
        //         title: 'Ooops..',
        //         text: 'Harus terisi.'
        //     })
        // }
        this.props.Loginthunk(username,password)

        // dibawah ini redux biasa
        // this.setState({ loading: true });
        // Axios.get(`${APIURL}users?username=${username}&password=${password}`)
        //     .then(res => {
        //         if (res.data.length) {
        //             localStorage.setItem("ini-key", res.data[0].id);
        //             this.props.LoginSuccessAction(res.data[0]);
        //             Swal.fire({
        //                 icon: "success",
        //                 title: `Selamat Datang ${username}!`,
        //                 text: 'Anda berhasil Login.'
        //             })
        //         } else if ((username === '' &&  password === '') || username === '' || password === '' ) {
        //             this.setState({error: "Belum terisi!"})
        //         } else {
        //             this.setState({ error: "Username atau Password salah!" });
        //         }
        //         this.setState({ loading: false });
        //     })
            // .catch(err => {
            //     console.log(err);
            //     this.setState({ loading: false });
            // });
    };

    render() { 
        if(this.props.AuthLogin){
            return <Redirect to={'/'}/>
        }
        return (  
            <div className="mx-auto" style={{backgroundColor:'#E6E6FA',  width: "40%"}}>
            <div className="mx-auto my-5 py-5" style={{ width: "40%"}}>
                <div className="text-center">
                    <h1 className="font-weight-bolder" style={{color:"DarkSlateGray"}}>Sign In</h1>
                </div>
                <div style={{textAlign:"center"}}>
                    <Form className="mt-5 pb-4" >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control  style={{width:'100%'}} ref="username" type="username" placeholder="Enter username" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control  style={{width:'100%'}} ref="password" type="password" placeholder="Enter Password" />
                        </Form.Group>
                        
                        {
                            this.props.Auth.loading ?
                            <Loader
                                type='Puff'
                                color='#00918e'
                                height={100}
                                width={100}
                            />
                            :
                            <Button className="btn btn-info" type="submit" onClick={this.onLoginClick}>Login</Button>
                        }
                        <div className="mt-3">
                            Don't have an Account?
                            <br/>Register <Link className='register' to={"/register"}>Here!</Link>{" "}
                        </div>
                    </Form>
                </div>
            </div>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        AuthLogin:state.Auth.login,
        Auth:state.Auth
    }
}


export default connect(mapStateToProps, {LoginSuccessAction, Loginthunk, Login_error}) (Lamanlogin);