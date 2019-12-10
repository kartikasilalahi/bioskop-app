const INITIAL_STATE=false

export default(state=INITIAL_STATE, action)=>{
    switch (action.type) {
        case 'OPEN_MODALLOGIN':
            return state= action.payload
        default:
            return state
    }
}