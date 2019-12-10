import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/APiUrl';
import {connect} from 'react-redux'
import {LoginSuccessAction, OpenModalLogin}  from '../redux/action'

class Moviedetail extends Component {
    state = {  
        datadetailfilm:{}
    }

    componentDidMount(){
        Axios.get(`${APIURL}movies/${this.props.match.params.id}`)
        .then(res=>{
            console.log(res.data)
            this.setState({datadetailfilm:res.data})
        }).catch(err=>{
            console.log(err)
        })
    }

    render() { 
        // console.log(this.props.match.params)
        // console.log('masuk')
        // console.log(this.props.location.pathname.split("/")[2])
        return ( 
            <div>

                <div className="row p-3 ">
                    <div className="col-md-5">
                        <img style={{marginLeft:'0'}} src={this.state.datadetailfilm.image} alt={this.state.datadetailfilm.title} height="400px" />
                        <div className="mt-3">
                            {this.state.datadetailfilm.title} 
                        </div>
                    </div>

                    <div className="col-md-2">

                    </div>

                    <div className="col-md-5">
                        <button >Beli Tiket</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        modalLogin: state.modalLogin
    }
}

export default connect(mapStateToProps, {LoginSuccessAction, OpenModalLogin}) (Moviedetail);