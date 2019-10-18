import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { ADD_POST, GET_POSTS, POST_ERROR, } from './post.types';

const route = 'http://localhost:3000';

// *************************** ADD POST *************************** //
export const addPost = ({ content }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ content });

  try {
    const res = await axios.post(`${route}/posts/new`, body, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post Created', 'success', 2000));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
    dispatch(setAlert('Error Creating Post', 'danger', 2000));
  }
};

// *************************** GET ALL POSTS *************************** //
export const getAllPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(`${route}/posts`);
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    })
  }
};