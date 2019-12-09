import React, { Component } from 'react';
import {Table, TableBody, TableHead, TableCell, TableRow} from '@material-ui/core';
import Axios from 'axios';
import { APIURL } from '../support/APiUrl';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class ManageAdmin extends Component {
    state = {  
        datafilm: [],
        readmoreselected: -1,
        modalAdd:false,
        selectidDel:-1,
        indexedit:-1,
        selectidEdit:-1,
        modalEdit: false
    }

    componentDidMount(){
        Axios.get(`${APIURL}movies`)
        .then(res=>{
            this.setState({datafilm:res.data})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // BUTTON SAVE
    btnSave=()=>{
        var jadwal = []
        var jadwaltemplate=["12:00","14:00","16:00","18:00","20:00"]
        for(var i = 0; i<jadwaltemplate.length;i++){
            if (this.refs[`jadwal${i}`].checked) {
                jadwal.push(jadwaltemplate[i])
            }
        }
        console.log('INI JADWAL',jadwal)
        var iniref=this.refs
        var title=iniref.title.value
        var image=iniref.image.value
        var sinopsis=iniref.sinopsis.value
        var sutradara=iniref.sutradara.value
        var durasi=iniref.durasi.value
        var genre=iniref.genre.value
        var produksi=iniref.produksi.value

        var data = {
            title:title,
            image,
            sinopsis,
            jadwal,
            sutradara,
            durasi,
            genre,
            produksi
        }
        if (title && image && sinopsis && sutradara && durasi && genre && produksi !== '') {
            Axios.post(`${APIURL}movies`, data)
            .then(()=>{
                Axios.get(`${APIURL}movies`)
                .then(res=>{
                    this.setState({datafilm:res.data, modalAdd:false})
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err=>{
                console.log(err)
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lengkapi Data!'
            })
        }
    }
    
    // BUTTON DELETE
    btnDelete=(index)=>{
        MySwal.fire({
            title: 'Yakin hapus ' + this.state.datafilm[index].title + '?',
            text: '',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result)=>{
            if (result.value) {
                var hapusdata = this.state.datafilm
                this.setState({selectidDel:hapusdata[index]["id"]})
                console.log('INI ID YANG DIHAPUS',hapusdata[index]["id"] )
                hapusdata.splice(index,1)
                this.setState({
                    hapusdata: hapusdata
                })
                MySwal.fire(
                    'Deleted',
                    'Berhasil dihapus!',
                    'success'
                )
                Axios.delete(`${APIURL}movies/${this.state.selectidDel}`)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                MySwal.fire(
                    'Cancelled',
                    'Tidak Jadi',
                    'error'
                )
            }
        })
    }

    // BUTTON EDIT
    btnEdit=(index)=>{
        var editData = this.state.datafilm
        this.setState({modalEdit:true,indexedit:index, selectidEdit:editData[index].id})
        console.log('INI ID YANG DI EDIT',editData[index].id)
        console.log('INI JAM YANG AKAN DI EDIT',editData[index].jadwal)
    }
    
    // FUNCTION EDIT/UPDATE DATA FILM
    updateFilm=()=>{
        var editjadwal = []
        var jadwaltemplate=["12:00","14:00","16:00","18:00","20:00"]
        for(var i = 0; i<jadwaltemplate.length;i++){
            if (this.refs[`editjadwal${i}`].checked) {
                editjadwal.push(jadwaltemplate[i])
            }
        }
        const {datafilm, indexedit} = this.state
        var jadwalAwal=datafilm[indexedit].jadwal
        var newdatafilm=this.state.datafilm
        var iniref=this.refs
        var edittitle=iniref.editTitle.value
        var editimage=iniref.editImage.value
        var editsinopsis=iniref.editSinopsis.value
        var editsutradara=iniref.editSutradara.value
        var editdurasi=iniref.editDurasi.value
        var editgenre=iniref.editGenre.value
        var editproduksi=iniref.editProduksi.value
        console.log("ini awal",jadwalAwal)
        console.log("ini akhir", editjadwal)

        var objnewdata = {
            title:edittitle,
            image:editimage,
            sinopsis:editsinopsis,
            jadwal:editjadwal,
            sutradara:editsutradara,
            durasi:editdurasi,
            genre:editgenre,
            produksi:editproduksi
        }
        
        newdatafilm.splice(this.state.indexedit,1,objnewdata)
        console.log("INI TITLE BARU",datafilm[indexedit]["title"])

        Axios.put(`${APIURL}movies/${this.state.selectidEdit}`, objnewdata)
        this.setState({datafilm:newdatafilm,modalEdit:false,indexedit:-1, selectidEdit:-1})

        MySwal.mixin({
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

    // Function renderfilm
    renderfilm=()=>{
        var {readmoreselected} = this.state
        return this.state.datafilm.map((val,index)=>{
            return(
                <TableRow key={index} >
                    <TableCell>{index+1}</TableCell>
                    <TableCell align="center" style={{fontWeight:"bolder"}} >{val.title}</TableCell>
                    <TableCell align="center"><img src={val.image} alt={val.title} height='200px'/></TableCell>
                        {   val.sinopsis.split('').length<=50?
                            <TableCell align="left" style={{width: "270px"}}>
                                {val.sinopsis}
                            </TableCell>
                            :
                            readmoreselected==index ? 
                            <TableCell align="left" style={{width: "270px"}}>
                                {val.sinopsis}
                                <span onClick={()=>this.setState({readmoreselected:-1})} style={{color:'#1E90FF', cursor:"pointer"}}>read less</span>
                            </TableCell>
                            :
                            <TableCell align="left" style={{width: "270px"}}>
                                {val.sinopsis.split('').filter((val,index)=>index<=50)} 
                                <span onClick={()=>this.setState({readmoreselected:index})} style={{color:'#1E90FF', cursor:"pointer"}}>read more..</span>
                            </TableCell>
                        }                    
                    <TableCell align="center" style={{width:"60px"}}>
                    {val.jadwal.map((v,i)=>{
                        return  <button className="btn btn-outline-info my-1" style={{height:"2rem", lineHeight:"14px", cursor:"text"}}>{v}</button>
                    })}
                    </TableCell>
                    <TableCell align="center" style={{width:"60px"}}>{val.sutradara}</TableCell>
                    <TableCell align="center" style={{width:"60px"}}>{val.durasi}</TableCell>
                    <TableCell align="center" style={{width:"60px"}}>{val.genre}</TableCell>
                    <TableCell align="center" style={{width:"60px"}}>{val.produksi}</TableCell>
                    <TableCell>
                        <button onClick={()=>this.btnEdit(index)} className="btn btn-outline-primary mb-2" style={{height:"2rem", lineHeight:"14px"}}>Edit</button> <br/>
                        <button onClick={()=>this.btnDelete(index)} className="btn btn-outline-danger" style={{height:"2rem", lineHeight:"14px"}}>Delete</button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    // jalankan RENDER
    render() { 
        const {datafilm,indexedit}=this.state 
        return (  
            <div> 
                {/* MODAL EDIT */}
                {   indexedit === -1 ? 
                    null
                    :
                    <Modal isOpen={this.state.modalEdit} toggle={()=>this.setState({modalEdit:false})} >
                        <ModalHeader>Edit Film</ModalHeader>
                        <ModalBody>
                            <input  type="text" defaultValue={datafilm[indexedit].title} ref="editTitle" placeholder="edit title" className="form-control mt-2"/>
                            <input type="text" defaultValue={datafilm[indexedit].image} ref="editImage" placeholder="edit image" className="form-control mt-2"/>
                            <input type="text" defaultValue={datafilm[indexedit].sinopsis} ref="editSinopsis" placeholder="edit sinopsis" className="form-control mt-2"/>
                            Jadwal: &nbsp;
                            <input type="checkbox" ref="editjadwal0"/>12.00 &nbsp;
                            <input type="checkbox" ref="editjadwal1"/>14.00 &nbsp;
                            <input type="checkbox" ref="editjadwal2"/>16.00 &nbsp;
                            <input type="checkbox" ref="editjadwal3"/>18.00 &nbsp;
                            <input type="checkbox" ref="editjadwal4"/>20.00
                            <input defaultValue={datafilm[indexedit].sutradara} type="text" ref="editSutradara" placeholder="edit sutradara" className="form-control mt-2"/>
                            <input defaultValue={datafilm[indexedit].durasi} type="text" ref="editDurasi" placeholder="edit durasi" className="form-control mt-2"/>
                            <input defaultValue={datafilm[indexedit].genre} type="text" ref="editGenre" placeholder="edit genre" className="form-control mt-2"/>
                            <input defaultValue={datafilm[indexedit].produksi} type="text" ref="editProduksi" placeholder="edit produksi" className="form-control mt-2"/>
                        </ModalBody>
                        <ModalFooter>
                        <button onClick={this.updateFilm} className="btn btn-success" >Save</button>
                        <button className='btn btn-danger' onClick={()=>this.setState({modalEdit:false})}>Cancel</button>
                    </ModalFooter>
                    </Modal>
                }

                {/* MODAL ADD FILM */}
                <button onClick={()=>this.setState({modalAdd:true})} className="btn btn-success">Add Data</button>
                <Modal isOpen={this.state.modalAdd} toggle={()=>this.setState({modalAdd:false})}>
                    <ModalHeader>Add Data</ModalHeader>
                    <ModalBody>
                        <input type="text" ref="title" placeholder="Title" className="form-control mt-2" />
                        <input type="text" ref="image" placeholder="Image" className="form-control mt-2" />
                        <input type="text" ref="sinopsis" placeholder="Sinopsis" className="form-control mt-2" />
                        Jadwal: &nbsp;
                            <input type="checkbox" ref="jadwal0"/>12.00 &nbsp;
                            <input type="checkbox" ref="jadwal1"/>14.00 &nbsp;
                            <input type="checkbox" ref="jadwal2"/>16.00 &nbsp;
                            <input type="checkbox" ref="jadwal3"/>18.00 &nbsp;
                            <input type="checkbox" ref="jadwal4"/>20.00 &nbsp;
                        <input type="text" ref="sutradara" placeholder="Sutradara" className="form-control mt-2" />
                        <input type="text" ref="durasi" placeholder="Durasi" className="form-control mt-2" />
                        <input type="text" ref="genre" placeholder="Genre" className="form-control mt-2" />
                        <input type="text" ref="produksi" placeholder="Produksi" className="form-control mt-2" />
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={this.btnSave}>Save</button>
                        <button className="btn btn-danger" onClick={()=>this.setState({modalAdd:false})}>Cancel</button>
                    </ModalFooter>
                </Modal>

                {/* TAMPILAN / OUTPUT DATA FILM */}
                <Table className="mt-4 mx-auto w-75">
                    <TableHead >
                        <TableRow className="tabelheader" >
                            <TableCell class="tbljudul">No.</TableCell>
                            <TableCell class="tbljudul">Judul</TableCell>
                            <TableCell class="tbljudul">Gambar</TableCell>
                            <TableCell class="tbljudul">Sinopsis</TableCell>
                            <TableCell class="tbljudul">Jadwal</TableCell>
                            <TableCell class="tbljudul">Sutradara</TableCell>
                            <TableCell class="tbljudul">Durasi</TableCell>
                            <TableCell class="tbljudul">Genre</TableCell>
                            <TableCell class="tbljudul">Produksi</TableCell>
                            <TableCell class="tbljudul">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="tabelbody">
                        {this.renderfilm()}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default ManageAdmin;
