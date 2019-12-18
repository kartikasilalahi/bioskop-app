import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {WiTime2} from 'react-icons/wi'
// import {totalHargaAction} from '../redux/action'
import {Redirect} from 'react-router-dom'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Table} from 'reactstrap'
import { APIURL } from '../support/APiUrl';

class History extends Component {
    state = {  
        detail:[],
        datacart:null,
        modaldetail:false,
        totalharga:0,
        title:'',
        qty:0
    }

    componentDidMount(){
        // console.log('ini userID',this.props.userId)
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=true`)
        .then(res=>{
            var datacart=res.data
            var harga = 0
            for(var i = 0; i < datacart.length;i++) {
                harga+=datacart[i].totalharga
            }
            this.setState({totalharga:harga})

            var qtyArr=[]
            res.data.forEach((element)=>{
                qtyArr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
            })
            var qtyArrFinal=[]
            Axios.all(qtyArr)
            .then(res1=>{
                res1.forEach((val)=>{
                    qtyArrFinal.push(val.data)
                })
                var datafinal=[]
                datacart.forEach((val,index)=>{
                    datafinal.push({...val,qty:qtyArrFinal[index]})
                })
                this.setState({datacart:datafinal})
            }).catch(err1=>{
                console.log(err1)
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    renderHistory=()=>{
        if (this.state.datacart!==null) {
            if (this.state.datacart.length===0) {
                return (
                    <tr>
                        <td></td>
                        <td className="p">Tabel History Kosong</td>
                    </tr>
                )
            }
            return this.state.datacart.map((val,index)=>{
                return(
                    <tr  key={index}>
                        <td style={{width:50, color:"white"}}>{index+1}</td>
                        <td style={{width:100, color:"white",}}>{val.tanggal}</td> 
                        <td style={{width:100, color:"white"}}>Rp.{val.totalharga},00</td>
                        <td style={{width:100, color:"white"}}>
                            <button onClick={()=>this.btnDetails(index)} className='mb-2 btn btn-outline-warning' style={{ fontSize:'12px',fontWeight:"bolder"}} >Details</button>
                        </td>
                    </tr>
                )
            })
        }
    }

    btnDetails=(index)=>{
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=true`)
        .then(res=>{
            var detailhistory = res.data
            var qtyArr=[]
            detailhistory.forEach((element)=>{
                qtyArr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
            })
            var qtyArrFinal=[]
            Axios.all(qtyArr)
            .then(res1=>{
                res1.forEach((val)=>{
                    qtyArrFinal.push(val.data)
                })
                var datafinal=[]
                detailhistory.forEach((val,index)=>{
                    datafinal.push({...val,qty:qtyArrFinal[index]})
                })
                detailhistory=datafinal
                var totalharga=detailhistory[index].totalharga
                var title=detailhistory[index].movie.title
                var qty=detailhistory[index].qty.length
                this.setState({
                    modaldetail:true,
                    totalharga:totalharga,
                    title:title,
                    qty:qty
                })
                }).catch(err1=>{
                console.log(err1)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    render() {
        if (this.props.userId && this.props.role==="user") {
            return (  
                <div>
                <Modal centered isOpen={this.state.modaldetail} toggle={()=>this.setState({modaldetail:false})} >
                    <ModalHeader><h4 className="font-weight-bold">Detail</h4></ModalHeader>
                    <ModalBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Movie</th>
                                    <th>Qty</th>
                                    <th>Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.state.title}</td>
                                <td>{this.state.qty}</td>
                                <td>Rp.{this.state.totalharga},00</td>
                            </tr>
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter><button className="btn btn-primary" onClick={()=>this.setState({modaldetail:false})}>OK</button></ModalFooter>
                </Modal>
                <div className="container mt-5" style={{width:"600px"}}>
                    <div className="mb-4 font-weight-bold p" style={{textAlign:'center', fontSize:"20px"}}>
                        Table History
                    </div>
                        <center>
                            <Table striped style={{width:'100%'}}>
                                <thead>
                                    <tr>
                                        <th className="p" style={{width:50}}>No</th>
                                        <th className="p" style={{width:100}}>Tanggal</th> 
                                        <th className="p" style={{width:100}}>Total Harga</th>
                                        <th className="p" style={{width:100}}>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderHistory()}
                                </tbody>
                            </Table>
                        </center>
                    </div>
                </div>
            );
        }
        return(
            <Redirect to={'/notfound'} />
        )
    }
}

const MapstateToProps=(state)=>{
    return{
        userId:state.Auth.id,
        username:state.Auth.username,
        role:state.Auth.role,
        totalharga:state.Cart.totalharga,
        bayar:state.Cart.bayar
    }
}

export default connect(MapstateToProps) (History);