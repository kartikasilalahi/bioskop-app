import Axios from "axios";
import { APIURL } from "../../support/APiUrl";
import Swal from 'sweetalert2'


export const LoginSuccessAction = datauser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: datauser
  };
};

export const Loginthunk = (username, password) => {
  return (dispatch) => {
    dispatch({ type: "LOGIN_LOADING" });
    Axios.get(`${APIURL}users?username=${username}&password=${password}`)
      .then(res => {
        console.log(res.data)
        if (res.data.length) {
          localStorage.setItem("ini-key", res.data[0].id);
          dispatch(LoginSuccessAction(res.data[0]));
          Swal.fire({
            icon: 'success',
            title: 'Login Success!',
            showConfirmButton: false,
            timer: 1500
          })
        } 
        else {
          dispatch({ type: "LOGIN_ERROR"});
          Swal.fire({
            icon: 'error',
            title: 'Oopps...',
            text: 'Password/Username salah'
        })
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "LOGIN_ERROR", payload: "Server Error" });
      });
  };
};

export const Login_error = () => {
  return dispatch => {
    dispatch({ type: "LOGIN_ERRROR", payload: '' });
  };
};

export const LogoutSuccessAction=()=>{
  return {
    type:'LOGOUT_SUCCESS'
  }
}

export const CartAction=(x)=>{
  return {
    type: 'QTY',
    payload: x
  }
}















































































// export const SettingAccount=(username,password)=>{
//   return{
//     type:"SETTING_ACCOUNT",
//     payload:{
//       username:username,
//       password:password
//     }
//   }
// }

// export const OpenModalLogin=()=>{
//     return{
//         type: 'OPEN_MODALLOGIN',
//         payload: true
//     }
// }

// export const CloseModalLogin=()=>{
//     return{
//         type: 'CLOSE_MODALLOGIN'
//     }
// }


// Swal.fire({
//   icon: "warning",
//   title: `Error!`,
//   text: this.props.Auth.error
// })
