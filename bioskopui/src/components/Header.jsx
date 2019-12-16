import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { Collapse, 
    Navbar, 
    NavbarToggler, 
    NavbarBrand, 
    Nav, 
    NavItem, 
    // NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import {connect} from 'react-redux'
import {LogoutSuccessAction} from '../redux/action'
import Swal from "sweetalert2";
import {FaCartPlus, FaUserCircle, FaUserCog} from 'react-icons/fa'
import managestudio from '../pages/managestudio';
// import {Redirect} from 'react-router-dom'


class Header extends Component {
    state = {  
        isOpen: false,
        setIsOpen: false, 
    }

    btnLogout=()=>{
        Swal.fire({
            title: 'Are you sure to logout?',
            icon: 'warning',
            showCancelButton: 'true',
            confirmButtonText: "Logout!"
        }).then(result=>{
            if (result.value) {
                Swal.fire({
                    title:'Logging out',
                    timer: 1800,
                    allowOutsideClick: false,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                })
                .then(()=>{
                    Swal.fire({
                        title:'Logout',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        localStorage.removeItem("ini-key");
                        this.props.LogoutSuccessAction()
                        
                    })
                })
            }
        })
    }


    render() { 
        return (
            <div>
            <Navbar className="bgnavbar" expand="md">
                <NavbarBrand style={{color:"white"}} href="/"><i className="fas fa-film"></i> Movies-App</NavbarBrand>
                <NavbarToggler onClick={()=>this.setState({setIsOpen:true})} />
                <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar> 
                    
                {this.props.role===''?
                    <NavItem>
                            <Link to={"/lamanlogin"} style={{cursor:"pointer", color:"white"}} ><i className="fas fa-sign-in-alt"></i> Sign In</Link>
                    </NavItem>
                : this.props.role==='admin' ?
                    (   <Nav>
                        
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret style={{color:"white", fontWeight:"bolder", fontSize:"18px"}}>
                        <i className="far fa-user"></i> {this.props.username}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={this.btnLogout}>
                            <i className="fas fa-sign-out-alt"></i> Log Out
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>
                                <Link style={{color:'black', textDecoration:'none'}}to={"/manageadmin"}>
                            <i className="far fa-window-restore"></i> Manage Admin</Link>
                            </DropdownItem>
                            <DropdownItem style={{color:'black', textDecoration:'none'}}>
                                <i className="far fa-window-restore"></i> Manage Studio
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
                    )

                :
                    <Nav>
                    <NavItem>
                            <Link to={"/cart"}> <FaCartPlus style={{color:'white', fontSize:"30"}} className="mr-2 pt-2" /></Link>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret style={{color:"white", fontWeight:"bolder", fontSize:"18px"}}>
                        <i className="far fa-user"></i> {this.props.username}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={this.btnLogout}>
                                <i className="fas fa-sign-out-alt" ></i> Log Out
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem style={{color:'black', textDecoration:'none'}} >
                                <i className="far fa-window-restore"></i>  History
                            </DropdownItem>
                            <DropdownItem><FaUserCog />
                                <Link to={"/setting"} style={{color:'black', textDecoration:'none'}} >  Setting</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
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
        username:state.Auth.username,
        role:state.Auth.role
    }
}
export default connect(mapStateToProps, {LogoutSuccessAction}) (Header);