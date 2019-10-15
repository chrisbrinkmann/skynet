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
    default :
      return state;
  };
};