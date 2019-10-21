import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { GET_PROFILE, PROFILE_ERROR, } from './profile.types';

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