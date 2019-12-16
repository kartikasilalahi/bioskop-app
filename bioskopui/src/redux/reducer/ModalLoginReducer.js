const INITIAL_STATE=false

export default(state=INITIAL_STATE, action)=>{
    switch (action.type) {
        case 'OPEN_MODALLOGIN':
            return state= action.payload
        case "CLOSE_MODALLOGIN":
            return INITIAL_STATE
        default:
            return state
    }
}