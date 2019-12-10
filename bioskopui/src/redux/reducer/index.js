import {combineReducers} from 'redux'
import AuthReducer from './AuthReducer'
import ModalLoginReducer from './ModalLoginReducer'

export default combineReducers({
    Auth:AuthReducer,
    modalLogin:ModalLoginReducer
})