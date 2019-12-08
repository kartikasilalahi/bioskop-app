import React, { Component } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Axios from 'axios'
import { APIURL } from '../support/APiUrl';

const MySwal = withReactContent(Swal)

class LamanLogin extends Component {
    state = {  
        datauser:[],
        modalLogin:true,
        Login:false
    }

    componentDidMount(){
        Axios.get(`${APIURL}users`)
        .then(res=>{
            this.setState({datauser:res.data})
        })
        .catch(err=>{
            console.log('error get nya',err)
        })
    }
    
    btnRegister=()=>{
        const {datauser,Login} = this.state
        var newUser = this.refs.username.value 
        var newPass = this.refs.password.value 
        var data = {
            username:newUser,
            password:newPass
        }
        if ( newPass && newUser !== '') {
            Axios.post(`${APIURL}users`, data)
            .then(()=>{
                Axios.get(`${APIURL}users`)
                .then(res=>{
                    this.setState({datauser:res.data, modalAdd:false})
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err=>{
                console.log(err)
            })
            MySwal.fire({
                icon: "success",
                title: 'Berhasil!',
                text: 'Berhasil Registrasi.'
            })
        } else {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lengkapi Data!'
            })
        }
    }

    btnLogin=()=>{
        const {datauser,Login} = this.state
        var inputUser = this.refs.username.value 
        var inputPass = this.refs.password.value 
        console.log(inputUser)
        for(var i = 0; i < datauser.length; i++){
            if (inputPass === datauser[i].password && inputUser==="admin" ) {
                this.setState({modalLogin:false, Login:true})
                MySwal.fire({
                    icon: "success",
                    title: 'Berhasil!',
                    text: 'Anda Masuk Laman Admin.'
                })
            } if (inputPass === datauser[i].password && inputUser===datauser[i].username) {
                this.setState({modalLogin:false,Login:true})
                MySwal.fire({
                    icon: "success",
                    title: 'Berhasil!',
                    text: 'Anda Masuk Laman User.'
                })
            } else {
                this.setState({Login:false})
                console.log("error login")
                
            }
        }
    }


    render() { 
        return (  
            <div>
                <Modal isOpen={this.state.modalLogin} toggle={()=>this.setState({modalLogin:false})}>
                    <ModalHeader>Laman Login</ModalHeader>
                    <ModalBody>
                        <input type="text" ref="username" placeholder="Enter username" className="form-control mt-2" />
                        <input type="password" ref="password" placeholder="Enter Password" className="form-control mt-2" />
                    </ModalBody>
                    <ModalFooter>
                        <button  onClick={this.btnRegister} className="btn btn-primary mb-2" style={{height:"2rem", lineHeight:"14px"}}>Register</button>
                        <button onClick={this.btnLogin} className="btn btn-primary mb-2" style={{height:"2rem", lineHeight:"14px"}}>Login</button>
                        
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}
export default LamanLogin;