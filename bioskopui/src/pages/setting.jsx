import React, { Component } from 'react';
import {connect} from 'react-redux'
import { Button, Form, Input } from "semantic-ui-react";
import Axios from 'axios';
import {APIURL} from '../support/APiUrl'
import Swal from 'sweetalert2'
import {Redirect} from 'react-router-dom'
class SettingAccount extends Component {
    state = {  
        datauser: null,
        setting:false
    }

    componentDidMount(){
        this.setState({datauser:this.props.Auth})
    }

    btnSave=()=>{
        var newusername=this.refs.username.value
        var currentpassword=this.refs.currentpassword.value
        var newpassword=this.refs.newpassword.value
        var confnewpassword=this.refs.confnewpassword.value
        var id=this.state.datauser.id
        console.log(id)
        var newdatauser={
            // username:newusername,
            password:newpassword,
            // role:'user'
        }
        
        if (currentpassword!==this.props.Auth.password) {
            alert('password saat ini salah')
        }
        if (newpassword==='' || confnewpassword==='' || newpassword==='' && confnewpassword==='') {
            alert('Harus terisi semua')
        } else if (newpassword!== confnewpassword) {
            alert('Password dan Confirm password tidak sama')
        } else {
            // Axios.put(`${APIURL}users/${id}`, newdatauser)
            Axios.patch(`${APIURL}users/${id}`, newdatauser)

            .then(res=>{
                Swal.fire({
                    title: 'Yakin melakukan perubahan password?',
                    icon: 'warning',
                    showCancelButton: 'true',
                    confirmButtonText: "Ya!"
                }).then(result=>{
                    if (result.value) {
                        Swal.fire({
                            title:'Sedang melakukan perubahan',
                            text:'Tunggu beberapa detik...',
                            timer: 1800,
                            allowOutsideClick: false,
                            timerProgressBar: true,
                            onBeforeOpen: () => {
                                Swal.showLoading()
                            }
                        })
                        .then(()=>{
                            Swal.fire({
                                title:'Berhasil',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1000
                            }).then(() => {
                                this.setState({setting:true})
                            })
                        })
                    }
                })
            }).catch(err=>{
                console.log(err)
            })
        }

    }

    render() { 
        if (this.state.setting) {
            return(
                <Redirect to={'/'} />
            )
        }
        return (  
            <div className="mx-auto mt-5" style={{backgroundColor:"#E6E6FA", width:"40%"}}>           
            <div className="mx-auto pt-4" style={{width:"80%"}}>
                <div className="text-center pb-3">
                    <h1 className='font-weight-bolder'style={{color:'DarkSlateGray'}}>Setting</h1>
                </div>
                <Form className="mt-3 pb-4">
                    <center>
                    <Form.Field>
                        <input disabled className="mb-4 text-center w-100" style={{color:'gray'}} defaultValue={this.props.Auth.username}  type="text"  ref="username"/>
                    </Form.Field>
                    <Form.Field>
                        <input className="mb-4 text-center w-100" style={{color:'gray'}} type="password" placeholder="current password" ref="currentpassword"/>
                    </Form.Field>
                    <Form.Field>
                        <input className="mb-4 text-center w-100" style={{color:'gray'}} type="password" placeholder="new password" ref="newpassword"/>
                    </Form.Field>
                    <Form.Field>
                        <input className="mb-4 text-center w-100"  style={{color:'gray'}} type="password" placeholder="confirm new password" ref="confnewpassword"/>
                    </Form.Field>
                    <Button className="btn btn-info" onClick={this.btnSave} type="submit">Save</Button>
                    
                    </center>
                </Form>
            </div>
            </div>
        );
    }
}

const MapStateToProps=state=>{
    return {
        Auth:state.Auth
    }
}

export default connect(MapStateToProps) (SettingAccount);