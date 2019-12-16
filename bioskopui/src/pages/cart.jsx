import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {Table, Button} from 'reactstrap'
import { APIURL } from '../support/APiUrl';
import {Redirect} from 'react-router-dom'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
// import Swal from 'sweetalert2'


class Cart extends Component {
    state = {  
        datacart:null,
        bookagain:false,
        modaldetail:false,
        detail:[]
    }

    componentDidMount(){
        // console.log('ini userID',this.props.userId)
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=false`)
        .then(res=>{
            // console.log('ini res data awal', res.data)
            var datacart=res.data
            var qtyArr=[]
            res.data.forEach((element)=>{
                qtyArr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
            })
            // console.log('qty arr', qtyArr)
            var qtyArrFinal=[]
            Axios.all(qtyArr)
            .then(res1=>{
                res1.forEach((val)=>{
                    qtyArrFinal.push(val.data)
                })
                var datafinal=[]
                // console.log('qty arrfinal', qtyArrFinal)
                datacart.forEach((val,index)=>{
                    datafinal.push({...val,qty:qtyArrFinal[index]})
                })
                // console.log('ini datafinal',datafinal)
                this.setState({datacart:datafinal})
            }).catch(err1=>{
                console.log(err1)
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    renderCart=()=>{
        if (this.state.datacart!==null) {
            if (this.state.datacart.length===0) {
            return (
                    <tr>
                        <td></td>
                        <td className="p">Cart Kosong</td>
                    </tr>
                )
            }
            console.log('ini ',this.state.datacart)

            return this.state.datacart.map((val,index)=>{
                return(
                    <tr  key={index}>
                        <td style={{width:100, color:"white"}}>{index+1}</td>
                        <td style={{width:300, color:"white"}}>{val.movie.title}</td>
                        <td style={{width:100, color:"white"}}>{val.jadwal}</td>
                        <td style={{width:100, color:"white"}}>{val.qty.length}</td>
                        <td style={{width:100, color:"white"}}>Rp.{val.totalharga},00</td>
                        <td style={{width:100, color:"white"}}>
                            <Button onClick={()=>this.btnDetails(index)} className='mb-2' style={{ fontSize:'12px',fontWeight:"bolder"}} >Details</Button>
                        </td>

                    </tr>
                )
            })
        }
    }


    btnDetails=(index)=>{
        console.log(this.state.datacart[index].id)
        var id = this.state.datacart[index].id
        // console.log(this.state.datacart[index])
        Axios.get(`${APIURL}ordersDetails?orderId=${id}`)
        .then(res=>{
            var detailfilm = res.data
            var seat = []
            var row = []
            detailfilm.map((val,index)=>{
                seat.push(val.seat)
                row.push(val.row)
            })
            var alp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            var posisi = []
            for(var i = 0; i < seat.length;i++){
                for(var j = 0; j < alp.length;j++){
                    if (row[i]===j) {
                        posisi.push(String(alp[j])+ (seat[i]+1))
                    }
                }
            }
            this.setState({detail:posisi})
            this.setState({modaldetail:true})
        })
    }

    render() { 
        if (this.props.userId && this.props.role==="user") {
            if (this.state.bookagain) {
                return <Redirect to={'/'}/>
            }
            return (  
                <div>
                <Modal centered isOpen={this.state.modaldetail} toggle={()=>this.setState({modaldetail:false})} >
                    <ModalHeader><h4 className="font-weight-bold">Detail</h4></ModalHeader>
                    <ModalBody>
                        <div className="d-flex mb-4">
                            <h6 className="mr-3 font-weight-bolder">Seat:</h6>
                            {this.state.detail.map((val,i)=>{return <button className="btn btn-outline-info mr-2 px-1 py-0 font-small" key={i}>{val}</button>})}
                        </div>
                        <div><h6 className="font-weight-bolder">Total: {this.state.detail.length} Kursi </h6></div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>this.setState({modaldetail:false})}>OK</button>
                    </ModalFooter>
                </Modal>

                <div className="container" style={{width:"600px"}}>
                    <center>
                        <Table striped style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th className="p" style={{width:100}}>No</th>
                                    <th className="p" style={{width:300}}>Title</th>
                                    <th className="p" style={{width:100}}>Jadwal</th>
                                    <th className="p" style={{width:100}}>Quantity</th>
                                    <th className="p" style={{width:100}}>Total Harga</th>
                                    <th className="p" style={{width:100}}>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                            </tbody>
                        </Table>
                        
                    </center>
                    <div className='d-flex'>
                        <h6 className='p ml-auto font-weight-bolder'>Total Harga: Rp.000.000</h6>
                    </div>
                    <div className="d-flex">
                        <button onClick={()=>this.setState({bookagain:true})} className="btn btn-outline-info">book another</button>
                        <button className="btn btn-success ml-auto">checkout</button>
                    </div>
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
        role:state.Auth.role
    }
}

export default connect(MapstateToProps)(Cart);
















    
