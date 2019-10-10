import { SET_ALERT, REMOVE_ALERT } from './alert.types';

// New alerts will be pushed into array
const INITIAL_STATE = [];

export const alertReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ALERT :
      return [
        ...state,
        action.payload,
      ];
    case REMOVE_ALERT :
      return state.filter(alert => alert.id !== action.payload)
    default :
      return state;
  };
};