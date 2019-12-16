import React, { Component } from 'react';
import {Table, TableBody, TableHead, TableCell, TableRow} from '@material-ui/core';
import Axios from 'axios';
import { APIURL } from '../support/APiUrl';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'
// import Managestudio from '../pages/managestudio'

const MySwal = withReactContent(Swal)

class ManageAdmin extends Component {
    state = {  
        datafilm: [],
        readmoreselected: -1,
        modalAdd:false,
        selectidDel:-1,
        indexedit:-1,
        selectidEdit:-1,
        modalEdit: false,
        jadwal:[12,14,16,18,20],
        datasudio:[]
    }

    componentDidMount(){
        Axios.get(`${APIURL}movies`)
        .then(res=>{
            Axios.get(`${APIURL}studios`)
            .then(res1=>{
                this.setState({
                    datafilm:res.data,
                    datastudio:res1.data
                })
                console.log(this.state.datastudio)
            })
            .catch(err1=>{
                console.log(err1)
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    // BUTTON SAVE
    btnSave=()=>{
        var jadwal = []
        var jadwaltemplate=[12,14,16,18,20]
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
        var studioId=iniref.studio.value
        var trailer=iniref.trailer.value
        
        var data = {
            title:title,
            image,
            sinopsis,
            jadwal,
            trailer,
            studioId,
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
        // console.log('INI ID YANG DI EDIT',editData[index].id)
        // console.log('INI JAM YANG AKAN DI EDIT',editData[index].jadwal)
    }
    
    // FUNCTION EDIT/UPDATE DATA FILM
    updateFilm=()=>{
        var editjadwal = []
        var jadwaltemplate=[12,14,16,18,20]
        for(var i = 0; i<jadwaltemplate.length;i++){
            if (this.refs[`editjadwal${i}`].checked) {
                editjadwal.push(jadwaltemplate[i])
            }
        }
        const {datafilm, indexedit} = this.state
        var newdatafilm=this.state.datafilm
        var iniref=this.refs
        var edittitle=iniref.editTitle.value
        var editimage=iniref.editImage.value
        var editsinopsis=iniref.editSinopsis.value
        var editsutradara=iniref.editSutradara.value
        var editdurasi=iniref.editDurasi.value
        var editgenre=iniref.editGenre.value
        var editproduksi=iniref.editProduksi.value
        var studioId=iniref.editStudio.value
        var trailer=iniref.editTrailer.value
        
        var objnewdata = {
            title:edittitle,
            image:editimage,
            sinopsis:editsinopsis,
            jadwal:editjadwal,
            trailer,
            studioId,
            sutradara:editsutradara,
            durasi:editdurasi,
            genre:editgenre,
            produksi:editproduksi,
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
                    <TableCell style={{color:'white'}} >{index+1}</TableCell>
                    <TableCell align="center" style={{fontWeight:"bolder", color:'white'}} >{val.title}</TableCell>
                    <TableCell style={{color:'white'}} align="center"><img src={val.image} alt={val.title} height='200px'/></TableCell>
                        {   val.sinopsis.split('').length<=50?
                            <TableCell align="left" style={{width: "270px", color:'white'}}>
                                {val.sinopsis}
                            </TableCell>
                            :
                            readmoreselected===index ? 
                            <TableCell align="left" style={{width: "270px", color:'white'}}>
                                {val.sinopsis}
                                <span onClick={()=>this.setState({readmoreselected:-1})} style={{color:'#1E90FF', cursor:"pointer"}}>read less</span>
                            </TableCell>
                            :
                            <TableCell align="left" style={{width: "270px", color:'white'}}>
                                {val.sinopsis.split('').filter((val,index)=>index<=50)} 
                                <span onClick={()=>this.setState({readmoreselected:index})} style={{color:'#1E90FF', cursor:"pointer"}}>read more..</span>
                            </TableCell>
                        }                    
                    <TableCell align="center" style={{width:"60px"}}>
                    {val.jadwal.map((v,i)=>{
                        return  <button className="btn btn-outline-info my-1" style={{height:"2rem", lineHeight:"14px", cursor:"text"}}>{v}:00</button>
                    })}
                    </TableCell>
                    
                    <TableCell align="center" style={{width:"60px", color:"white"}}>{val.sutradara}</TableCell>
                    <TableCell align="center" style={{width:"60px", color:"white"}}>{val.durasi}</TableCell>
                    <TableCell align="center" style={{width:"60px", color:"white"}}>{val.genre}</TableCell>
                    <TableCell align="center" style={{width:"60px", color:"white"}}>{val.produksi}</TableCell>
                    <TableCell>
                        <button onClick={()=>this.btnEdit(index)} className="btn btn-primary mb-2" style={{height:"2rem", lineHeight:"14px"}}>Edit</button> <br/>
                        <button onClick={()=>this.btnDelete(index)} className="btn btn-danger" style={{height:"2rem", lineHeight:"14px"}}>Delete</button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    // checkBox  ADDjadwal
    renderAddCheckBox=()=>{
        return this.state.jadwal.map((val,index)=>{
            return(
                <div key={index}>
                    <input type="checkbox" ref={`jadwal${index}`}/>
                    <span className="mr-2">{val}.00</span>
                </div>

            )
        })
    }

    // checkBox EDIT jadwal
    renderEditCheckBox=(indexedit)=>{
        var indexarr = []
        var datafilmEdit = this.state.datafilm[indexedit].jadwal
        for(var i = 0; i < datafilmEdit.length; i++){
            for(var j = 0; j < this.state.jadwal.length; j++){
                if(datafilmEdit[i]===this.state.jadwal[j])
                    indexarr.push(j)
            }
        }

        var checkBox = this.state.jadwal
        var checkBoxNew = []
        checkBox.forEach((val)=>{
            checkBoxNew.push({jam:val,tampiledit:false})
        })

        indexarr.forEach((val)=>{
            checkBoxNew[val].tampiledit=true
        })
        return checkBoxNew.map((val,index)=>{
            if (val.tampiledit) {
                return (
                    <div>
                        <input type="checkbox" defaultChecked ref={`editjadwal${index}`} value={val.jam} />
                        <span className='mr-2'>{val.jam}.00</span>
                    </div>
                )
            }else {
                return (
                    <div>
                        <input type="checkbox" ref={`editjadwal${index}`} value={val.jam} />
                        <span className='mr-2'>{val.jam}.00</span>
                    </div>
                )
            }
        })
    }

    // jalankan RENDER
    render() { 
        if (this.props.role==="admin"){
        const {datafilm,indexedit}=this.state 
        const {length} = datafilm
        if (length===0) {
            return <div>Loadingg...</div>
        }
        return (  
            <div className='container'> 
                {/* MODAL EDIT */}
                {   indexedit === -1 ? 
                    null
                    :
                    <Modal isOpen={this.state.modalEdit} toggle={()=>this.setState({modalEdit:false})} >
                        <ModalHeader>Edit Film {datafilm[indexedit].title}</ModalHeader>
                        <ModalBody>
                            <input type="text" defaultValue={datafilm[indexedit].title} ref="editTitle" placeholder="edit title" className="form-control mt-2"/>
                            <input type="text" defaultValue={datafilm[indexedit].image} ref="editImage" placeholder="edit image" className="form-control mt-2"/>
                            <textarea rows="5" defaultValue={datafilm[indexedit].sinopsis} ref="editSinopsis" placeholder="edit sinopsis" className="form-control mt-2"/>
                            Jadwal: &nbsp;
                            <div className="d-flex">
                                {this.renderEditCheckBox(indexedit)}
                            </div>
                            <input type="text" ref="editTrailer" placeholder="Trailer" className="form-control mt-2" />
                            <select ref="editStudio" className="form-control mt-2">
                                <option value="1">Studio 1</option>
                                <option value="2">Studio 2</option>
                                <option value="3">Studio 3</option>
                            </select>
                            <input defaultValue={datafilm[indexedit].sutradara} type="text" ref="editSutradara" placeholder="edit sutradara" className="form-control mt-2"/>
                            <input defaultValue={datafilm[indexedit].durasi} type="text" ref="editDurasi" placeholder="edit durasi" className="form-control mt-2"/>
                            <input defaultValue={datafilm[indexedit].genre} type="text" ref="editGenre" placeholder="edit genre" className="form-control mt-2"/>
                            <input defaultValue={datafilm[indexedit].produksi} type="text" ref="editProduksi" placeholder="edit produksi" className="form-control mt-2"/>
                        </ModalBody>
                        <ModalFooter>
                        <button  onClick={this.updateFilm} className="btn btn-success" >Save</button>
                        <button className='btn btn-danger' onClick={()=>this.setState({modalEdit:false})}>Cancel</button>
                    </ModalFooter>
                    </Modal>
                }

                {/* MODAL ADD FILM */}
                <button onClick={()=>this.setState({modalAdd:true})} className="btn btn-success mt-4">Add Data</button>
                
                <Modal isOpen={this.state.modalAdd} toggle={()=>this.setState({modalAdd:false})}>
                    <ModalHeader>Add Data</ModalHeader>
                    <ModalBody>
                        <input type="text" ref="title" placeholder="Title" className="form-control mt-2" />
                        <input type="text" ref="image" placeholder="Image" className="form-control mt-2" />
                        <textarea type="text" ref="sinopsis" placeholder="Sinopsis" className="form-control mt-2" />
                        Jadwal:
                        <div className="d-flex">
                                {this.renderAddCheckBox()}
                        </div>
                        <input type="text" ref="trailer" placeholder="Trailer" className="form-control mt-2" />
                        <select ref="studio" className="form-control mt-2">
                            {
                                this.state.datastudio.map((val)=>{
                                    return ( <option value={val.id}>{val.nama}</option>)
                                })
                            }
                        </select>
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
                            <TableCell className="tbljudul" style={{color:'white'}}>No.</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Judul</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Gambar</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Sinopsis</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Jadwal</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Sutradara</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Durasi</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Genre</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Produksi</TableCell>
                            <TableCell className="tbljudul" style={{color:'white'}}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="tabelbody">
                        {this.renderfilm()}
                    </TableBody>
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

export default connect(MapstateToProps) (ManageAdmin);
