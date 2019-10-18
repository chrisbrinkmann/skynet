import { ADD_POST, POST_ERROR } from './post.types';

const INITIAL_STATE = {
  posts: [],
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
        loading: false,
        error: {},
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