export const LoginSuccessAction=(datauser)=>{
    return{
        type:'LOGIN_SUCCESS',
        payload: datauser
    }
}

export const OpenModalLogin=()=>{
    return{
        type: 'OPEN_MODALLOGIN',
        payload: true
    }
}