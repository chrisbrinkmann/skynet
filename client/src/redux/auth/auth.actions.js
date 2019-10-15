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

// *************************** REGISTER USER *************************** //
export const registerUser = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  const route = 'http://localhost:3000';

  try {
    const res = await axios.post(`${route}/users/register`, body, config);
    dispatch({
      type: REGISTRATION_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(
        setAlert(error.msg, 'danger')
      ));
    };
    dispatch({
      type: REGISTRATION_FAIL,
    });
  }
};

// *************************** LOGIN USER *************************** //
export const loginUser = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const body = JSON.stringify({ email, password });

  const route = 'http://localhost:3000';

  try {
    const res = await axios.post(`${route}/users/login`, body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(
        setAlert(error.msg, 'danger', 2000)
      ))
    }
    dispatch({
      type: LOGIN_FAIL
    });
  };
};