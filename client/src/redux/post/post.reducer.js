import { ADD_POST, DELETE_POST, GET_NEWSFEED, ADD_COMMENT, DELETE_COMMENT, POST_ERROR } from './post.types';

const INITIAL_STATE = {
  posts: [],
  newsfeed: [],
  post: null,
  loading: true,
  error: {},
}

export const postReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_POST :
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        newsfeed: [action.payload, ...state.newsfeed],
        loading: false,
        error: {},
      };
    case DELETE_POST :
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        newsfeed: state.newsfeed.filter(item => item.id !== action.payload),
        loading: false,
      };
    case GET_NEWSFEED :
      return {
        ...state,
        newsfeed: action.payload,
        loading: false,
      };
    case ADD_COMMENT :
    case DELETE_COMMENT :
      return {
        ...state,
        post: {
          ...state.post,
          comments: action.payload,
        },
      };
    case POST_ERROR :
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default :
      return state;
  };
};