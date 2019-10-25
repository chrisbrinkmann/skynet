import { GET_RELATIONS, GET_FRIENDS, GET_USERS, SEND_REQUEST, ACCEPT_REQUEST, DECLINE_UNFRIEND, RELATIONS_ERROR } from './relations.types';

const INITIAL_STATE = {
  friendsList: [],
  relationships: [],
  allRelations: [],
  users: [],
  loading: true,
  error: {},
};

export const relationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USERS : 
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case GET_FRIENDS : 
      return {
        ...state,
        friendsList: action.payload,
        loading: false,
      };
    case GET_RELATIONS : 
      return {
        ...state,
        allRelations: action.payload,
        loading: false,
      };
    case SEND_REQUEST :
      return {
        ...state,
        allRelations: [...state.allRelations, action.payload],
        loading: false,
      };
    case ACCEPT_REQUEST :
    case DECLINE_UNFRIEND :
      return {
        ...state,
        friendsList: [...state.friendsList, action.payload],
        loading: false,
      };
    case RELATIONS_ERROR : 
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default : 
      return state;
  }
};