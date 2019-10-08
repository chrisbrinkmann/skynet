
const INITIAL_STATE = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default :
      return state;
  };
};