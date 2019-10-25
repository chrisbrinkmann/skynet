import { combineReducers } from 'redux';

import { alertReducer } from './alert/alert.reducer';
import { authReducer } from './auth/auth.reducer';
import { postReducer } from './post/post.reducer';
import { profileReducer } from './profile/profile.reducer';
import { relationsReducer } from './relations/relations.reducer';

export const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  post: postReducer,
  profile: profileReducer,
  relations: relationsReducer,
});