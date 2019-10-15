import { 
  REGISTRATION_SUCCESS, REGISTRATION_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_USER, AUTH_ERROR, USER_LOADED 
} from './auth.types';

const INITIAL_STATE = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOADED :
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case REGISTRATION_SUCCESS :
    case LOGIN_SUCCESS :
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTRATION_FAIL :
    case LOGIN_FAIL :
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default :
      return state;
  };
};