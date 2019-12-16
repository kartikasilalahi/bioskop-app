import {combineReducers} from 'redux'
import AuthReducer from './AuthReducer'
// import ModalLoginReducer from './ModalLoginReducer'
import cartReducer from './cartReducer'

export default combineReducers({
    Auth:AuthReducer,
    // modalLogin:ModalLoginReducer
    Cart:cartReducer

})