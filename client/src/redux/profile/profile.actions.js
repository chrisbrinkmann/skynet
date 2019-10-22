import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { GET_PROFILE, UPDATE_PROFILE, PROFILE_ERROR, } from './profile.types';

const route = process.env.REACT_APP_API_URL;

// *************************** GET USER PROFILE *************************** //
export const getUserProfile = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`${route}/users/profile/${userId}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
  };
};

// *************************** UPDATE PROFILE *************************** //
export const updateProfile = (data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/users/name`, data, config) && await axios.patch(`${process.env.REACT_APP_API_URL}/users/bio`, data, config);

    if (data === 'name') {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
    } else if (data === 'bio') {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
    };
    dispatch(setAlert(`Profile successfully updated`, 'success', 2000));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
    dispatch(setAlert('Error updating profile', 'danger', 2000));
  };
};