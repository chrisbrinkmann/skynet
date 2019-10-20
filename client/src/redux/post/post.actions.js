import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { ADD_POST, DELETE_POST, GET_POSTS, POST_ERROR, } from './post.types';

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

// *************************** DELETE POST *************************** //
export const deletePost = (postId) => async (dispatch) => {
  try {
    if (window.confirm('Please confirm you want to delete this post. This action cannot be undone.')) {
      const res = await axios.delete(`${route}/posts/${postId}`);
      dispatch({
        type: DELETE_POST,
        payload: res.data,
      });
      dispatch(setAlert('Post Successfully Delete', 'success', 2000));
    }
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      }
    });
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