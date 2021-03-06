import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import { ADD_POST, DELETE_POST, GET_NEWSFEED, ADD_COMMENT, DELETE_COMMENT, POST_ERROR, } from './post.types';

const route = process.env.REACT_APP_API_URL;

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
  if (window.confirm('Please confirm you want to delete this post. This action cannot be undone.')) {
    try {
      await axios.delete(`${route}/posts/${postId}`);
      dispatch({
        type: DELETE_POST,
        payload: postId,
      });
      dispatch(setAlert('Post deleted successfully', 'success', 2000));
    } catch (err) {
      console.error(err);
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status, 
        }
      });
      dispatch(setAlert('Error deleting post', 'danger', 2000));
    };
  };
};

// *************************** GET NEWSFEED *************************** //
export const getNewsfeed = () => async (dispatch) => {
  try {
    const res = await axios.get(`${route}/posts/newsfeed`);
    dispatch({
      type: GET_NEWSFEED,
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

// *************************** ADD COMMENT *************************** //
export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/comments/new/${postId}`, formData, config);
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
    dispatch(setAlert('Error adding comment', 'danger', 2000));
  };
};

// *************************** DELETE COMMENT *************************** //
export const deleteComment = (commentId) => async (dispatch) => {
  if (window.confirm('Please confirm you want to delete this comment. This action cannot be undone.')) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${commentId}`);
  
      dispatch({
        type: DELETE_COMMENT,
        payload: commentId,
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        }
      });
      dispatch(setAlert('Error deleting comment', 'danger', 2000));
    };
  }
};