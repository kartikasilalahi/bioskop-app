import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { connect } from 'react-redux';



class Managestudio extends Component {
    state = {  }
    render() { 
        return (  
            <div>
                <Modal>
                    <ModalHeader>
                        Manage Studio
                    </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-outline-info">close</button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}
const MapstateToProps=(state)=>{
    return{
        role:state.Auth.role
    }
}

export default connect(MapstateToProps) (Managestudio);