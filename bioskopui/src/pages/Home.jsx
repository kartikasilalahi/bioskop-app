import React, { Component } from 'react';
import Axios from "axios"
import {APIURL} from '../support/APiUrl';
import {Link} from 'react-router-dom'
import {Carousel} from 'react-bootstrap'
import {Icon} from 'semantic-ui-react'

class Home extends Component {
    state = {
        dataMovies:[]
    }
    
    componentDidMount(){
        Axios.get(`${APIURL}movies`)
        .then((res)=>{
            this.setState({dataMovies:res.data})
            // console.log(res.data)
            // console.log(this.state.dataMovies[0].durasi)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    renderMovies=()=>{
        
        return this.state.dataMovies.map((val,index)=>{
            const durasi=this.state.dataMovies[index].durasi
            // console.log(durasi)
            return(
                <div key={index} className="col-md-3 pb-3 pr-4 pl-4 p">
                    <div className="card kartu" style={{width:'100%', border:"transparent"}}>
                        <div className="gambar" style={{zIndex:1}}>
                            <Link to={'/moviedetail/'+val.id}>
                                <img src={val.image} className="card-img-top kartu gbr" alt={val.title}/>
                            </Link>
                            <Link to={'/moviedetail/'+val.id}>
                                <center><button disabled className="btn btn-warning mx-auto p-0" 
                                style={{zIndex:2, position:"absolute", top:10, right:8, borderRadius:"100%", fontSize:"10px", fontWeight:"bolder", lineHeight:'14px', height:"35px", width:"35px"}}
                                >{durasi}</button> </center>
                            </Link>
                        </div>
                    </div>
                        <div className="card-body">
                                <h6 className="card-title font-weight-bold text-center p" >{val.title}</h6>
                                <Link to={'/moviedetail/'+val.id}>
                                <center><button className="btn btn-outline-info mx-auto" >detail <i className="far fa-eye"></i></button> </center>
                            </Link>
                        </div>                
                </div>
            )
        })
    }

    render() { 
        return (
            <div>
                <Carousel>
                    <Carousel.Item>
                        <img className="d-block w-100" src="https://media.21cineplex.com/webcontent/gallery/pictures/157424629656226_925x527.jpg" height="600px" alt="First slide"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="d-block w-100" src="https://media.21cineplex.com/webcontent/gallery/pictures/157424567014515_925x527.jpg" height="600px" alt="First slide"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="d-block w-100" src="https://www.mainmain.id/uploads/post/2019/12/08/jumanji_mainmain.jpeg" height="600px" alt="First slide"/>
                    </Carousel.Item>
                </Carousel>

            <div className="my-2" style={{width:"100%"}}>
            <Icon name='user'/><h3 style={{textAlign:"left", paddingLeft:"10%", height:"8px", paddingTop:"5px", color:"white", fontWeight:"bold"}}>Now Playing</h3><br/>
                <div className="row py-3 w-100" style={{paddingLeft:'8%', paddingRight:'8%'}}>
                    {this.renderMovies()}
                </div>
            </div>
            </div>
        );
    }
}

export default Home;