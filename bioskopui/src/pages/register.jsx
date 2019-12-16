import React, { Component } from 'react';
import { Button, Checkbox, Form } from "semantic-ui-react";
import Axios from 'axios'
import Swal from "sweetalert2";
import { APIURL } from '../support/APiUrl'
import {Redirect} from 'react-router-dom'


class Register extends Component {
    state = { 
        registered:false
    }

    btnRegister=()=>{
        var username=this.refs.username.value
        var password=this.refs.password.value
        var confpassword=this.refs.confpassword.value
        var role="user"
        var regist = {
            username,
            password,
            role
        }
        if (username && password && confpassword !== '') {
            Axios.get(`${APIURL}users?username=${username}`)
            .then((res)=>{
                if (res.data.length===0) {
                    if (password !== confpassword) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Password must match!'
                        })
                    }else {
                        
                        Axios.post(`${APIURL}users`, regist)
                        .then(()=>{
                            Axios.get(`${APIURL}users`)
                            .then(()=>{
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success!',
                                    text: 'Registered! You can sign in now'
                                })
                                this.setState({registered:true})
                                // this.props.history.push('login')    // 
                            }).catch(error=>{
                                console.log(error)
                            })
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                }else{
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: `Account with username ${username} is already used, Try using another username`
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lengkapi Data!'
            })
        }
    }

    render() { 
        if (this.state.registered) {
            console.log('masuk')
            return <Redirect to={'/lamanlogin'}/>
        }
        return (  
            <div className="mx-auto mt-5" style={{backgroundColor:"#E6E6FA", width:"40%"}}>           
            <div className="mx-auto pt-4" style={{width:"80%"}}>
                <div className="text-center pb-3">
                    <h1 className='font-weight-bolder'style={{color:'DarkSlateGray'}}>Register</h1>
                </div>
                <Form className="mt-3 pb-4">
                    <center>
                    <Form.Field>
                        <input className="mb-4 text-center w-100" placeholder="username" type="text"  ref="username"/>
                    </Form.Field>
                    <Form.Field>
                        <input className="mb-4 text-center w-100" type="password" placeholder="password" ref="password"/>
                    </Form.Field>
                    <Form.Field>
                        <input className="mb-4 text-center w-100" type="password" placeholder="confirm password" ref="confpassword"/>
                    </Form.Field>
                    </center>
                    <Form.Field>
                        <Checkbox label="I agree to the Terms and Conditions"/>
                    </Form.Field>
                    <center>
                    <Button className="btn btn-info" onClick={this.btnRegister} type="submit">Register</Button>
                    </center>
                </Form>
            </div>
            </div>
        );
    }
}

export default Register;