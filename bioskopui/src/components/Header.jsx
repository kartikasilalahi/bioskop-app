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
import {FaCartPlus,FaUserCog} from 'react-icons/fa'
import {Redirect} from 'react-router-dom'


class Header extends Component {
    state = {  
        isOpen: false,
        setIsOpen: false, 
        balik:false
    }

    // BUTTON LOGOUT
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
                    text:'tunggu beberapa detik',
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
                        this.setState({balik:true})
                        window.location.reload()
                        
                    })
                })
            }
        })
    }
    
    
    render() { 
        if (this.state.balik) {
            return <Redirect to={'/'}/>
        }
        return (
            <div>
            <Navbar className="bgnavbar" expand="md">
                <NavbarBrand style={{color:"white"}} href="/"><i className="fas fa-film"></i> Movies-App</NavbarBrand>
                <NavbarToggler onClick={()=>this.setState({setIsOpen:true})} />
                <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar> 
                    
                {
                    this.props.role===''?
                    <NavItem>
                            <Link to={"/lamanlogin"} style={{cursor:"pointer", color:"white"}} ><i className="fas fa-sign-in-alt"></i> Sign In</Link>
                    </NavItem>
                    : 
                    this.props.role==='admin' ?
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
                            <DropdownItem>
                                <Link style={{color:'black', textDecoration:'none'}}to={"/managestudio"}>
                            <i className="far fa-window-restore"></i> Manage Studio</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
                    )
                    :
                    <Nav>
                    {/* {console.log('ini cart',this.props.Cart)} */}
                    <NavItem style={{zIndex:2, position:'absolute', color:'red', fontWeight:'bolder', top:1}}>
                        {
                            this.props.Cart===0 ? null :
                            <button className="btn btn-danger" style={{padding:1,fontSize:'10px'}}>{this.props.Cart}</button>
                        }
                    </NavItem>
                    <NavItem>
                            <Link to={"/cart"}><FaCartPlus style={{color:'white', fontSize:"30", zIndex:1}} className="mr-2 pt-2 " /></Link>
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
                            <Link style={{color:'black', textDecoration:'none'}}to={"/history"}>
                                <i className="far fa-window-restore"></i>  History</Link>
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
        role:state.Auth.role,
        Cart:state.Cart.cart
    }
}
export default connect(mapStateToProps, {LogoutSuccessAction}) (Header);