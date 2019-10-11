import { SET_ALERT, REMOVE_ALERT } from './alert.types';
import uuid from 'uuid/v4';

export const setAlert = (msg, alertType, timeout = 3000) => (dispatch) => {
  const id = uuid();

  dispatch ({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id
    }
  });

  // Remove SET_ALERT after indicated 'timeout'
  setTimeout(() => dispatch({
    type: REMOVE_ALERT,
    payload: id,
  }), timeout);
  
};

