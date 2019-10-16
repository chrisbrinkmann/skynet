import { combineReducers } from 'redux';

import { alertReducer } from './alert/alert.reducer';
import { authReducer } from './auth/auth.reducer';
import { postReducer } from './post/post.reducer';

export const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  post: postReducer,
});