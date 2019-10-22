import { GET_PROFILE, UPDATE_PROFILE, PROFILE_ERROR } from './profile.types';

const INITIAL_STATE = {
  currentProfile: null,
  loading: true,
  error: {},
};

export const profileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROFILE :
      return {
        ...state,
        currentProfile: action.payload,
        loading: false,
      };
    case UPDATE_PROFILE :
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile,
          name: action.payload.name,
          bio: action.payload.bio,
        },
        loading: false,
      };
    case PROFILE_ERROR :
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default : 
      return state;
  }
};