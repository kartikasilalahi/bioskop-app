import React, { Component } from 'react';
import {Table, TableBody, TableHead, TableCell, TableRow, TableFooter} from '@material-ui/core';
import Axios from 'axios';
import { APIURL } from '../support/APiUrl';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'


class Managestudio extends Component {
    state = {  
        datastudio:[],
        modalEdit:false,
        indexedit:-1,
        idEdit:-1,
        idDelete:-1,
        modalAdd:false
    }

    componentDidMount(){
        Axios.get(`${APIURL}studios`)
        .then(res=>{
            this.setState({datastudio:res.data})
            console.log(this.state.datastudio)
        }).catch(err=>{
            console.log(err)
        })
    }



    renderstudio=()=>{
        return this.state.datastudio.map((val,index)=>{
            return(
                <TableRow key={index}>
                    <TableCell align="center" style={{color:'white'}}>{index+1}</TableCell>
                    <TableCell align="center" style={{color:'white'}}>{val.nama}</TableCell>
                    <TableCell align="center" style={{color:'white'}}>{val.jumlahKursi}</TableCell>
                    <TableCell align="center" style={{color:'white'}}>
                        <button onClick={()=>this.btnEdit(index)} className="btn btn-info mr-4 p-1" style={{fontSize:"10px"}}>Edit</button>
                        <button onClick={()=>this.btnDelete(index)} className="btn btn-warning p-1" style={{fontSize:"10px"}}>Delete</button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    btnEdit=(index)=>{
        var editStudio = this.state.datastudio
        // console.log(editStudio[index].nama)
        this.setState({indexedit:index, modalEdit:true, idEdit:editStudio[index].id})
    }

    updateStudio=()=>{
        var editStudio=[]
        var iniref=this.refs
        var nama=iniref.nama.value
        var jumlahKursi=iniref.jumlahKursi.value
        var newdata=this.state.datastudio

        var objnew={nama:nama,jumlahKursi:jumlahKursi}
        newdata.splice(this.state.indexedit,1,objnew)
        Axios.put(`${APIURL}studios/${this.state.idEdit}`, objnew)
        this.setState({datastudio:newdata,modalEdit:false,indexedit:-1,idEdit:-1})

        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        }).fire({
            icon: 'success',
            title: 'Berhasil Edit'
        })
    }


    newStudio=()=>{
        var iniref=this.refs
        var nama=iniref.addnama.value
        var jumlahKursi=iniref.addjumlahKursi.value
        var newdata={nama,jumlahKursi}

        if (nama && jumlahKursi !== '') {
            Axios.post(`${APIURL}studios`, newdata)
            .then(()=>{
                Axios.get(`${APIURL}studios`)
                .then((res)=>{
                    this.setState({datastudio:res.data,  modalAdd:false})
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Berhasil diambahkan!'
                    })
                })
                .catch(error=>{
                    console.log(error)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lengkapi Data!'
            })
        }
    }


    btnDelete=(index)=>{
        Swal.fire({
            title: 'Yakin hapus ' + this.state.datastudio[index].nama + '?',
            text: '',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result)=>{
            if (result.value) {
                var hapusdata = this.state.datastudio
                this.setState({idDelete:hapusdata[index]["id"]})
                Swal.fire(
                    'Deleted',
                    'Berhasil dihapus!',
                    'success'
                )
                Axios.delete(`${APIURL}studios/${this.state.idDelete}`)
                .then(()=>{
                    Axios.get(`${APIURL}studios`)
                    .then(respon=>{
                        this.setState({datastudio:respon.data})
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
                
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Tidak Jadi',
                    'error'
                )
            }
        })
    }

    render() { 
        if (this.props.role==="admin"){
            const {datastudio, indexedit} = this.state
            const {length} = datastudio
            if (length===0) {
                return <div>Loadingg...</div>
            }
        return (  
            <div>
                <div className='mt-3'>
                    <h4 style={{color:'white', textAlign:'center'}}>Manage Studio</h4>
                </div>

                {
                    indexedit===-1 ? null :
                    <Modal centered isOpen={this.state.modalEdit} toggle={()=>this.setState({modalEdit:false})}>
                        <ModalHeader>Edit {datastudio[indexedit].nama}</ModalHeader>
                        <ModalBody>
                            <input type="text" defaultValue={datastudio[indexedit].nama} ref="nama" className="form-control mt-2"/>
                            <input type="number" defaultValue={datastudio[indexedit].jumlahKursi} ref="jumlahKursi" className="form-control mt-2"/>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={this.updateStudio} className="btn btn-success p-1">save</button>
                        </ModalFooter>
                    </Modal>
                }

                <Modal centered isOpen={this.state.modalAdd} toggle={()=>this.setState({modalAdd:false})}>
                    <ModalHeader>Add New Studio</ModalHeader>
                    <ModalBody>
                        <input type="text" placeholder="Nama studio" ref="addnama" className="form-control mt-2"/>
                        <input type="text" placeholder="Jumlah Seat" ref="addjumlahKursi" className="form-control mt-2"/>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={this.newStudio} className="btn btn-success p-1">save</button>
                        <button onClick={()=>this.setState({modalAdd:false})} className="btn btn-danger p-1">cancel</button>
                    </ModalFooter>
                </Modal>


                <Table className="mt-4 mx-auto w-50">
                    <TableHead >
                        <TableRow className="tabelheader" >
                            <TableCell className="tbljudul" style={{color:'white', textAlign:'center'}}>No.</TableCell>
                            <TableCell className="tbljudul" style={{color:'white', textAlign:'center'}}>Studio</TableCell>
                            <TableCell className="tbljudul" style={{color:'white', textAlign:'center'}}>Jumlah Seat</TableCell>
                            <TableCell className="tbljudul" style={{color:'white', textAlign:'center'}}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="tabelbody">
                        {this.renderstudio()}
                    </TableBody>
                    <TableFooter>
                        <button onClick={()=>this.setState({modalAdd:true})} className="btn btn-success p-2 mt-3" style={{fontSize:'12px'}}>Add</button>
                    </TableFooter>
                </Table>
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
        role:state.Auth.role
    }
}
export default connect(MapstateToProps)(Managestudio)