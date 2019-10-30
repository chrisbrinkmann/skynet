import { GET_RELATIONS, GET_FRIENDS, RESET_SEARCH, GET_USERS, SEND_REQUEST, ACCEPT_REQUEST, DECLINE_UNFRIEND, SEARCH_USERS, RELATIONS_ERROR } from './relations.types';

const INITIAL_STATE = {
  friendsList: [],
  relationships: [],
  allRelations: [],
  users: [],
  searchField: '',
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
    case SEARCH_USERS :
      return {
        ...state,
        searchField: action.payload,
        loading: false,
      };
    case RESET_SEARCH:
      return {
        ...state,
        searchField: action.payload,
        loading: false,
      }
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