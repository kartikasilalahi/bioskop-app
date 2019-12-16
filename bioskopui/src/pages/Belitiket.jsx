import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/APiUrl";
import { connect } from "react-redux";
import Numeral from 'numeral'
import {Modal, ModalBody, ModalFooter} from 'reactstrap'
import {Redirect} from 'react-router-dom'

class Belitiket extends Component {
    state = {
        datamovie: {},
        seats: 260,
        baris: 0,
        booked: [],
        loading: true,
        jam: 12,
        pilihan: [],
        redirecthome: false,
        openmodalcart: false
    };

    componentDidMount() {
        this.onJamChange();
    }

    onJamChange = () => {
    // console.log(this.props.location.state)
    var studioId = this.props.location.state.studioId;
    var movieId = this.props.location.state.id;
    Axios.get(`${APIURL}studios/${studioId}`)
        .then(res1 => {
            Axios.get(`${APIURL}orders?movieId=${movieId}&jadwal=${this.state.jam}`)
            .then(res2 => {
                var arrAxios = [];
                res2.data.forEach(val => {
                    arrAxios.push(
                        Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`)
                    );
                });
            var arrAxios2 = [];
            Axios.all(arrAxios)
                .then(res3 => {
                    // console.log('res3', res3)
                    res3.forEach(val => {
                        arrAxios2.push(...val.data);
                    });
                    this.setState({
                        datamovie: this.props.location.state,
                        seats: res1.data.jumlahKursi,
                        baris: res1.data.jumlahKursi / 20,
                        booked: arrAxios2,
                        loading: false
                    });
                })
                .catch(err3 => {
                    console.log(err3);
                });
            })
            .catch(err2 => {
                console.log(err2);
            });
        })
        .catch(err1 => {
            console.log(err1);
        });
    };

    onButtonjamclick = val => {
        this.setState({ jam: val, pilihan: [] });
        this.onJamChange();
    };

    onPilihSeatClick = (row, seat) => {
        var pilihan = this.state.pilihan;
        pilihan.push({ row: row, seat });
        this.setState({ pilihan: pilihan });
    };

    renderHargadanQuantity=()=>{
        var jumlahtiket=this.state.pilihan.length
        var harga=jumlahtiket*25000
        return(
            <div>
                {jumlahtiket} tiket x {'Rp.'+ Numeral(25000).format('0,0.00')} = {'Rp.' + Numeral(harga).format('0,0.00')}
            </div>
        )
    }

    onCancelseatClick = (row, seat) => {
        var pilihan = this.state.pilihan;
        var rows = row;
        var seats = seat;
        var arr = [];
        for (var i = 0; i < pilihan.length; i++) {
            if (pilihan[i].row !== rows || pilihan[i].seat !== seats) {
                arr.push(pilihan[i]);
            }
        }
        this.setState({ pilihan: arr });
    };

    renderseat = () => {
    var arr = [];
    for (var i = 0; i < this.state.baris; i++) {
        arr.push([]);
        for (var j = 0; j < this.state.seats / this.state.baris; j++) {
            arr[i].push(1);
        }
    }
    // console.log('booked', this.state.booked)
    for (var l = 0; l < this.state.booked.length; l++) {
        arr[this.state.booked[l].row][this.state.booked[l].seat] = 3; 
    }

    for (var k = 0; k < this.state.pilihan.length; k++) {
        arr[this.state.pilihan[k].row][this.state.pilihan[k].seat] = 2; 
    }
    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    var jsx = arr.map((val, index) => {
        return (
            <div className="text-center" key={index}>
            {val.map((val1, i) => {
                if (val1 === 3) {
                    return (
                        <button key={i} disabled className="rounded btn-disble mr-2 mt-2 bg-danger text-center " >
                            {alphabet[index] + (i + 1)}
                        </button>
                    );
                } else if (val1 === 2) {
                    return (
                        <button key={i} onClick={() => this.onCancelseatClick(index, i)} className="rounded btn-order mr-2 mt-2 btn-pilih text-center" >
                            {alphabet[index] + (i + 1)}
                        </button>
                    );
                }
                return (
                    <button key={i} onClick={() => this.onPilihSeatClick(index, i)} className="rounded btn-order mr-2 mt-2 text-center" >
                        {alphabet[index] + (i + 1)}
                    </button>
                );
            })}
        </div>
    );
    });
    return jsx;
    };

    renderbutton = () => {
        return this.state.datamovie.jadwal.map((val, index) => {
            if (this.state.jam === val) {
                return (
                    <button key={index} className="mx-2 btn btn-warning" >
                        {val}.00
                    </button>
                );
            }
            return (
                <button key={index} className="mx-2 btn btn-outline-warning" onClick={() => this.onButtonjamclick(val)}>
                    {val}.00
                </button>
            );
        });
    };

    onOrderClick=()=>{
        var userId=this.props.UserId
        var movieId=this.state.datamovie.id
        var pilihan=this.state.pilihan
        var jadwal=this.state.jam
        var totalharga=this.state.pilihan.length*25000
        var bayar=false
        var dataorders={
            userId,
            movieId,
            totalharga,
            jadwal,
            bayar
        }
        Axios.post(`${APIURL}orders`, dataorders)
        .then((res)=>{
            console.log(res.data.id)
            var dataordersdetail=[]
            pilihan.forEach((val)=>{
                dataordersdetail.push({
                    orderId:res.data.id,
                    seat:val.seat,
                    row:val.row
                })
            })
            console.log(dataordersdetail)
            var dataordersdetail2=[]
            dataordersdetail.forEach(val=>{
                dataordersdetail2.push(Axios.post(`${APIURL}ordersDetails`, val))
            })
            Axios.all(dataordersdetail2)
            .then(res1=>{
                console.log(res1)
                this.setState({openmodalcart:true})
            }).catch(err=>{
                console.log(err)
            })

        }).catch(err=>{
            console.log(err)
        })
    }

    render() {
        if (this.props.role==="user") {
            if (this.state.redirecthome) {
                return <Redirect to={'/'}/>
            }
            return (
                <div>
                    <Modal isOpen={this.state.openmodalcart}>
                        <ModalBody>
                            Cart berhasil di tambahkan
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-primary" onClick={()=>this.setState({redirecthome:true})}>OK</button>
                        </ModalFooter>
                    </Modal>
                    
                    <center className="mt-1">
                        <div className="mb-4">
                            <h4 className="p">{this.state.datamovie.title}</h4>
                        </div>
                        {this.state.loading ? null : this.renderbutton()}
                        {
                            this.state.pilihan.length ?
                            <div className="mt-3 p">
                                {this.renderHargadanQuantity()}
                            </div>
                            :
                            null
                        }
                        <div>
                            {this.state.pilihan.length ? (
                                <button onClick={this.onOrderClick} className="btn btn-primary mt-3">Order</button>
                            ) : null}
                        </div>
                        

                    </center>
                    <div className="d-flex justify-content-center mt-4 pb-5">
                        <div>
                            {this.state.loading ? null : this.renderseat()}
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <Redirect to={'/notfound'}/>
        )
    }
}

const MapstateToprops = state => {
    return {
        AuthLogin: state.Auth.login,
        UserId: state.Auth.id,
        role: state.Auth.role
    };
};

export default connect(MapstateToprops)(Belitiket);
