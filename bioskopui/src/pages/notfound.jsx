import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'


class Notfound extends Component {
    state = {  
        gohome:false
    }
    render() {
        if (this.state.gohome) {
            return  <Redirect to={'/'}/>
        } 
        return (  
            <div>
                <figure>
                    <div class="sad-mac"></div>
                    <figcaption>
                        <span className="sr-text">Error 404: Not Found</span>
                        <span className="e"></span>
                        <span className="r"></span>
                        <span className="r"></span>
                        <span className="o"></span>
                        <span className="r"></span>
                        <span className="_4"></span>
                        <span className="_0"></span>
                        <span className="_4"></span>
                        <span className="n"></span>
                        <span className="o"></span>
                        <span className="t"></span>
                        <span className="f"></span>
                        <span className="o"></span>
                        <span className="u"></span>
                        <span className="n"></span>
                        <span className="d"></span>
                    </figcaption>
                <div >
                    <button onClick={()=>this.setState({gohome:true})} className="btn btn-outline-warning" style={{marginLeft:'35%'}}>go back home</button>
                </div>
                </figure>
            </div>
        );
    }
}
 
export default Notfound;