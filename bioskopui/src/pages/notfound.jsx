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
                
            </div>
        );
    }
}
 
export default Notfound;