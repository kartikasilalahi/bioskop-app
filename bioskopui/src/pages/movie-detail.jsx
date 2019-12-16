import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/APiUrl';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {Modal, ModalBody, ModalFooter} from 'reactstrap'


class Moviedetail extends Component {
    state = {  
        datadetailfilm:{},
        opentrailer: false,
        bolehbeli:false,
        belumlogin: false,
        kelogin: false
    }

    componentDidMount(){
        Axios.get(`${APIURL}movies/${this.props.match.params.id}`)
        .then(res=>{
            this.setState({datadetailfilm:res.data})
        }).catch(err=>{
            console.log(err)
        })
    }

    btnBeliTiket=()=>{
        if (this.props.AuthLogin) {
            this.setState({bolehbeli:true})
        }
        else{
            this.setState({belumlogin:true})
        }
    }

    render() { 
        if (this.state.kelogin) {
            return <Redirect to={'/lamanlogin'} />
        }

        if (this.state.bolehbeli) {
            return <Redirect to={{pathname:'/belitiket', state: this.state.datadetailfilm}} />
        }
        
        return ( 
            <div>
                {/* MODAL TRAILER */}
                <Modal centered isOpen={this.state.opentrailer} size='lg' toggle={()=>this.setState({opentrailer:false})}
                    contentClassName='trailer' >
                    <ModalBody className='p-0 bg-transparent'>
                        <iframe width="100%" height="100%" src={this.state.datadetailfilm.trailer} title={this.state.datadetailfilm.title} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.belumlogin} centered toggle={()=>this.setState({belumlogin:false})}>
                    {console.log('modal')}
                    <ModalBody>
                        Anda belum login, silahkan login.
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={()=>this.setState({kelogin:true})}>Oke</button>
                    </ModalFooter>
                </Modal>

                <div className="row pt-3 w-100">
                    <div className="col-md-4 pl-5">
                        <div className="p pb-3 font-weight-bolder">
                            {this.state.datadetailfilm.title} 
                        </div>
                        
                        <img src={this.state.datadetailfilm.image} alt={this.state.datadetailfilm.title} height="450px" />
                    </div>

                    <div className="col-md-2 pt-5" style={{width:"200px"}}>
                        <div className='pt-3 p'>
                            Sutradara 
                        </div>
                        <div className='pt-3 p'>
                            Produksi 
                        </div>
                        <div className='pt-3 p'>
                            Durasi
                        </div>
                        <div className='pt-3 p'>
                            Genre
                        </div>
                        <div className='pt-3 p'>
                            Sinopsis  
                        </div>
                    </div>

                    <div className="col-md-1 pt-5">
                        
                        <div className='pt-3 p'>
                            :
                        </div>
                        <div className='pt-3 p'>
                            :
                        </div>
                        <div className='pt-3 p'>
                            :
                        </div>
                        <div className='pt-3 p'>
                            :
                        </div>
                        <div className='pt-3 p'>
                            : 
                        </div>
                    </div>

                    <div className="col-md-5 pt-5">
                        <div className='pt-3 p'>
                            {this.state.datadetailfilm.sutradara}
                        </div>
                        <div className='pt-3 p'>
                            {this.state.datadetailfilm.produksi}
                        </div>  
                        <div className='pt-3 p'>
                            {this.state.datadetailfilm.durasi}
                        </div>
                        <div className='pt-3 p'>
                            {this.state.datadetailfilm.genre}
                        </div>
                        <div className='pt-3 p'>
                            {this.state.datadetailfilm.sinopsis}
                        </div>
                        <div className="mt-3 ">
                            <button className="mr-3 btn btn-primary" onClick={this.btnBeliTiket}><i className="fas fa-shopping-cart"></i> Beli Tiket</button>
                            <button className="mr-3 btn btn-outline-info " onClick={()=>this.setState({opentrailer:true})}><i className="fas fa-video"></i> Trailer</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        AuthLogin:state.Auth.login
    }
}
export default connect(mapStateToProps)(Moviedetail);