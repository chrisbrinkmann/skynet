import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { setAuthToken } from '../utils/setAuthToken';
import { 
  REGISTRATION_SUCCESS, REGISTRATION_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_USER, AUTH_ERROR, USER_LOADED 
} from './auth.types';

// *************************** LOAD USER *************************** //
export const loadUser = (token) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  };

  const route = 'http://localhost:3000';

  try {
    const res = await axios.get(`${route}/users`);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  };
};