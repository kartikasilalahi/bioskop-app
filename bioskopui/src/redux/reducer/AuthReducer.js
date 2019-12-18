const INITIAL_STATE = {
  id: 0,
  username: "",
  password: "",
  login: false,
  role: "",
  error: "",
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload, login: true, loading: false, error: "" };
    case "LOGIN_LOADING":
      return { ...state, loading: true, error: "" };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT_SUCCESS":
      return INITIAL_STATE    
    default:
      return state;
  }
};
 