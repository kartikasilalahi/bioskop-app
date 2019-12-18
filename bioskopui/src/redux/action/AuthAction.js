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
          window.location.reload()
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







// export const Loginthunk = (username, password) => {
//   return (dispatch) => {
//     dispatch({ type: "LOGIN_LOADING" });
//     Axios.get(`${APIURL}users?username=${username}&password=${password}`)
//       .then(res => {
//         console.log(res.data)
//         if (res.data.length) {
//           var id=res.data[0].id
//           console.log('ini id', id)
//           Axios.get(`${APIURL}users/${id}`)
//           .then((res)=>{
//             Axios.get(`${APIURL}orders?_expand=movie&userId=${id}&bayar=false`)
//             .then(res1=>{
//               var datacart=res1.data
//               dispatch(CartAction(datacart.length))
//               console.log('ini length cart', datacart.length)
//               localStorage.setItem("ini-key", id);
//               dispatch(LoginSuccessAction(res1.data[0]));
//               Swal.fire({
//                 icon: 'success',
//                 title: 'Login Success!',
//                 showConfirmButton: false,
//                 timer: 1500
//               })
//             })
//           }).catch((err)=>{
//             console.log(err)
//           })
          
//           // console.log('ini',res.data[0].id)
//           // Axios.get()

//         } 

//         else {
//           dispatch({ type: "LOGIN_ERROR"});
//           Swal.fire({
//             icon: 'error',
//             title: 'Oopps...',
//             text: 'Password/Username salah'
//         })
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         dispatch({ type: "LOGIN_ERROR", payload: "Server Error" });
//       });
//   };
// };








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
    type: 'ADD_CART',
    payload: x
  }
}

export const totalHargaAction=(x)=>{
  return{
    type:'TOTAL_HARGA',
    payload: x
  }
}

export const CheckoutSuccessAction=()=>{
  return{
    type:'CHECKOUT_SUCCESS',
    payload: true
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
