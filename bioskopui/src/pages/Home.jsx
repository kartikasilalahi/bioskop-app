import React, { Component } from 'react';
import Axios from "axios"
const url="http://localhost:2000/"


class Home extends Component {
    state = {
        dataMovies:[]
    }
    
    componentDidMount(){
        Axios.get(`${url}movies`)
        .then((res)=>{
            this.setState({dataMovies:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    
    readMore=()=>{
        
    }
    
    renderMovies=()=>{

        return this.state.dataMovies.map((val,index)=>{
            return(
                <div key={index} className="col-md-3 pr-4 pl-4">
                    <div className="card kartu" style={{width:'100%'}}>
                        <div className="gambar1">
                            <img src={val.image} className="card-img-top kartu gambar" alt={val.title}/>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title font-weight-bold" >{val.title}</h5>
                            <p className="card-text">{val.sinopsis}</p>
                            
                            <a href="#" className="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                </div>
            )
        })
    }

    render() { 
        return (
            <div className="my-2">
                <h3 style={{textAlign:"left", paddingLeft:"10%", height:"8px", paddingTop:"5px"}}>List</h3><br/>
                <div className="row py-3" style={{paddingLeft:'8%', paddingRight:'8%'}}>
                
                    {this.renderMovies()}
                </div>
            </div>
        );
    }
}

export default Home;