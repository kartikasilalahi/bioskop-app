import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {Table} from 'reactstrap'
import { APIURL } from '../support/APiUrl';
import {Redirect} from 'react-router-dom'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {WiTime2} from 'react-icons/wi'
import {totalHargaAction,CheckoutSuccessAction} from '../redux/action'
import Swal from 'sweetalert2';



class Cart extends Component {
    state = {  
        datacart:null,
        modaldetail:false,
        detail:[],
        totalharga:0,
        tampungdata:[]
    }

    componentDidMount(){
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=false`)
        .then(res=>{
            var datacart=res.data
            var harga = 0
            for(var i = 0; i < datacart.length;i++) {
                harga+=datacart[i].totalharga
            }
            this.setState({totalharga:harga})
            this.props.totalHargaAction(this.state.totalharga)            
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

    btnCheckout=()=>{
        Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
        })
        Swal.fire({
            title: 'Yakin untuk checkout?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                Swal.fire( 'Berhasil!', 'Orderan berhasil di checkout', 'success')
                    var today = new Date();
                    var day = String(today.getDate()).padStart(2, '0');
                    var mounth = String(today.getMonth() + 1).padStart(2, '0'); 
                    var year = today.getFullYear();
                    today = day + '/' + mounth + '/' + year;

                    var datacheckout=this.state.datacart
                    for(var i = 0;i < datacheckout.length; i++){
                        var tampung={
                            bayar:true, 
                            tanggal:today,
                            id:datacheckout[i].id
                        }
                        var id=tampung.id
                        Axios.patch(`${APIURL}orders/${id}`, tampung)
                        .then(ress=>{
                            this.componentDidMount()
                            window.location.reload()
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Tidak jadi','','error')
            }
        })
    }
    
    renderCart=()=>{
        if (this.state.datacart!==null) {
            console.log('iniiiiiiiiiiiiiiii',this.state.datacart)
            if (this.state.datacart.length===0) {
                return (
                    <tr>
                        <td></td>
                        <td className="p">Cart Kosong</td>
                    </tr>
                )
            }
            return this.state.datacart.map((val,index)=>{
                return(
                    <tr  key={index}>
                        <td style={{width:100, color:"white"}}>{index+1}</td>
                        <td style={{width:300, color:"white"}}>{val.movie.title}</td>
                        <td style={{width:150, color:"white"}}><WiTime2 /> {val.jadwal}:00</td>
                        <td style={{width:100, color:"white", textAlign:'center'}}>{val.qty.length}</td>
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
        var id = this.state.datacart[index].id
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
                for(var j = 0; j < alp.length;j++) if (row[i]===j) posisi.push(String(alp[j])+ (seat[i]+1))
            }
            this.setState({detail:posisi, modaldetail:true})
        })
    }
    
        
    render() { 
        // this.props.totalHargaAction(this.state.totalharga)
        if (this.props.userId && this.props.role==="user") {
            return (  
            <div>
                {/* MODAL EDIT */}
                <Modal centered isOpen={this.state.modaldetail} toggle={()=>this.setState({modaldetail:false})} >
                    <ModalHeader><h4 className="font-weight-bold">Detail</h4></ModalHeader>
                    <ModalBody>
                        <div className="d-flex mb-4">
                            <h6 className="mr-3 font-weight-bolder">Seat:</h6>
                                {this.state.detail.map((val,i)=>{
                                    return <button className="btn btn-outline-info mr-2 px-1 py-0 font-small" style={{cursor:'text'}} key={i}>{val}</button>
                                })}
                        </div>
                        <div>
                            <h6 className="font-weight-bolder">Total: {this.state.detail.length} Seat </h6>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>this.setState({modaldetail:false})}>OK</button>
                    </ModalFooter>
                </Modal>

                {/* TABEL CART */}
                <div className="container" style={{width:"600px"}}>
                    <div className="mb-4 font-weight-bold p" style={{textAlign:'center', fontSize:"20px"}}>
                        Table Cart
                    </div>
                    <center>
                        <Table style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th className="p" style={{width:100}}>No</th>
                                    <th className="p" style={{width:300}}>Title</th>
                                    <th className="p" style={{width:150}}>Jadwal</th>
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
                        <h6 className='p ml-auto font-weight-bolder'>Total Harga: Rp{this.props.totalharga},00</h6>
                    </div>
                    <div className="d-flex">
                        <button onClick={this.btnCheckout} className="btn btn-success ml-auto">checkout</button>
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
        role:state.Auth.role,
        totalharga:state.Cart.totalharga,
        bayar:state.Cart.bayar
    }
}

export default connect(MapstateToProps, {totalHargaAction, CheckoutSuccessAction})(Cart);
















    
