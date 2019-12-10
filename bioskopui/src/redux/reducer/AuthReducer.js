const INITIAL_STATE = {
  id: "",
  username: "",
  password: "",
  login: false,
  role: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      // console.log({...state,...action.payload,login:true})
      return { ...state, ...action.payload, login: true };

    default:
      return state;
  }
};
