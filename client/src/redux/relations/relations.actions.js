import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { GET_RELATIONS, GET_FRIENDS, GET_USERS, SEND_REQUEST, ACCEPT_REQUEST, DECLINE_UNFRIEND, RELATIONS_ERROR } from './relations.types';

// *************************** GET RELATIONS *************************** //
export const getAllRelations = () => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/relations`);
    dispatch({
      type: GET_RELATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RELATIONS_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
  };
};

// *************************** GET FRIENDS *************************** //
export const getAllFriends = () => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/relations/friends-list`);
    dispatch({
      type: GET_FRIENDS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RELATIONS_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
  };
};

// *************************** GET USERS *************************** //
export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
    dispatch({
      type: GET_USERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RELATIONS_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
  };
};

// *************************** SEND FRIEND REQUEST *************************** //
export const sendFriendRequest = (friendId) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/relations/request/${friendId}`);
    dispatch({
      type: SEND_REQUEST,
      payload: res.data,
    });
    dispatch(setAlert('Request sent', 'success', 2000));
  } catch (err) {
    dispatch({
      type: RELATIONS_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
    dispatch(setAlert('Error sending request', 'danger', 2000));
  };
};

// *************************** ACCEPT REQUEST *************************** //
export const acceptRequest = (friendId) => async (dispatch) => {
  try {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/relations/accept/${friendId}`);
    dispatch({
      type: ACCEPT_REQUEST,
      payload: res.data,
    });
    dispatch(setAlert('Friend Request Accepted', 'success', 2000));
  } catch (err) {
    dispatch({
      type: RELATIONS_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
    dispatch(setAlert('Error accepting request', 'danger', 2000));
  };
};

// *************************** DECLINE OR UNFRIEND *************************** //
export const declineOrUnfriend = (friendId) => async (dispatch) => {
  if (window.confirm('Please confirm you want to decline request / remove friend.')) {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/relations/${friendId}`);
      dispatch({
        type: DECLINE_UNFRIEND,
        payload: res.data,
      });
      dispatch(setAlert('Decline / Unfriend successful', 'success', 2000));
    } catch (err) {
      dispatch({
        type: RELATIONS_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        }
      });
      dispatch(setAlert('Error with decline / unfriend, please try again', 'danger', 2000));
    };
  };
};