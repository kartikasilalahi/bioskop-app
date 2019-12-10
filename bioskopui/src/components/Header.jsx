import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from "reactstrap";

import Swal from 'sweetalert2'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Axios from 'axios'
import { APIURL } from '../support/APiUrl';
import {connect} from 'react-redux'
import {LoginSuccessAction, OpenModalLogin}  from '../redux/action'

class Header extends Component {
    state = {  
        isOpen: false,
        setIsOpen: false, 
        // Login: false,
        pesanError: ''
    }

    // function button klik LOGIN
    btnLogin=()=>{
        var username=this.refs.username.value 
        var password=this.refs.password.value
        Axios.get(`${APIURL}users?username=${username}&password=${password}`)
        .then((res)=>{
            if (res.data.length) {
                localStorage.setItem("ini-key", res.data[0].id)
                this.props.LoginSuccessAction(res.data[0])
                Swal.fire({
                    icon: "success",
                    title: `Selamat Datang ${username}!`,
                    text: 'Anda berhasil Login.'
                })
                // this.setState({modalLogin:false})
                // this.props.OpenModalLogin(true)
                // console.log(this.props.OpenModalLogin(true))

            } else {
                this.setState({pesanError:`Username atau Password Anda salah 
                Atau mungkin User ${username} belum terdaftar. Coba Lagi!`})
                Swal.fire({
                    icon: "error",
                    title: 'Gagal',
                    text: this.state.pesanError
                })
            }
        }).catch((err)=>{
            console.log("di axios error" + err)
        })
    }

    // toggle={()=>(this.props.modalLogin:false)}

    render() { 
        const {isOpen, setIsOpen} = this.state
        const toggle = () => setIsOpen(!isOpen);

        return (
            <div>
                {/* Modal TAMPILAN LOGIN */}
                {
                    this.props.modalLogin===false ?
                    <div>
                        {console.log(false)}
                    </div>
                    :
                    <Modal isOpen={this.props.modalLogin}>
                        {console.log(true)}
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
                }

            {/* NAVBAR HEADER */}
            <Navbar color="gray" light expand="md">
                <NavbarBrand href="/">Movies-App</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>

                {this.props.role==='' ?
                (
                    <NavItem>
                        <NavLink style={{cursor:"pointer"}} onClick={()=>this.props.OpenModalLogin(true)}>Login</NavLink>
                    </NavItem>
                ) : this.props.role==='admin' ?
                (
                    <NavItem>
                        <NavLink className="d-inline" style={{cursor:"pointer"}} href="/manageadmin" >Manage Admin</NavLink>
                        <NavLink className="font-weight-bold">{this.props.username}</NavLink>
                    </NavItem>
                ) : (
                    <NavItem>
                        <NavLink className="font-weight-bold">{this.props.username}</NavLink>
                    </NavItem>
                )
                }
                
                </Nav>
                </Collapse>
            </Navbar>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        AuthLogin:state.Auth.login,
        username:state.Auth.username,
        role:state.Auth.role,
        modalLogin: state.modalLogin
    }
}
export default connect(mapStateToProps, {LoginSuccessAction, OpenModalLogin})(Header);