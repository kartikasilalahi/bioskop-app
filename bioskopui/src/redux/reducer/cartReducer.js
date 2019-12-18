const INITIAL_STATE = {
    cart:0,
    totalharga:0,
    bayar:false
} 

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_CART":
            return {...state,cart:action.payload}
        case "TOTAL_HARGA":
            return {...state,totalharga:action.payload}
        case "CHECKOUT_SUCCESS":
            return {...state,bayar:action.payload}
        default:
            return state;
    }
};