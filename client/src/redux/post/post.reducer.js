
const INITIAL_STATE = {
  posts: [],
  post: null,
  loading: true,
  error: {},
}

export const postReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default :
      return state;
  };
};