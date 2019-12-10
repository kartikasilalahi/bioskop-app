import React, { Component } from 'react';
import Axios from "axios"
import {APIURL} from '../support/APiUrl'
// import { Modal } from '@material-ui/core';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

class Home extends Component {
    state = {
        dataMovies:[],
        Modalshowdetail:false
    }
    
    componentDidMount(){
        Axios.get(`${APIURL}movies`)
        .then((res)=>{
            this.setState({dataMovies:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    klikImage=(index)=>{
        this.setState({Modalshowdetail:true})
    }

    renderMovies=()=>{
        
        return this.state.dataMovies.map((val,index)=>{
            return(
                <div key={index} className="col-md-3 pb-3 pr-4 pl-4">
                    <div className="card kartu" style={{width:'100%', border:"transparent"}}>
                        <div className="gambar">
                            <img onClick={()=>this.klikImage(index)} src={val.image} className="card-img-top kartu gbr" alt={val.title}/>
                        </div>
                        <div className="card-body">
                                <h6 className="card-title font-weight-bold" >{val.title}</h6>
                        </div>                
                    </div>
                </div>
            )
        })
    }

    render() { 
        return (
            
            <div className="my-2" style={{width:"100%"}}>
            {
                this.state.Modalshowdetail ? 
                <Modal isOpen={this.state.Modalshowdetail} toggle={()=>this.setState({Modalshowdetail:false})}>
                    <ModalHeader>Info Film</ModalHeader>
                    <ModalBody>
                        <h5>isiiiii</h5>
                    </ModalBody>

                </Modal>:
                null
            }
                <h3 style={{textAlign:"left", paddingLeft:"10%", height:"8px", paddingTop:"5px"}}>List Movie</h3><br/>
                
                <div className="row py-3 w-100" style={{paddingLeft:'8%', paddingRight:'8%'}}>
                    {this.renderMovies()}
                </div>
            </div>
        );
    }
}

export default Home;