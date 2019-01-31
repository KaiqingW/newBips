import * as authActions from '../actions/auth.action';
import { User } from '../models/user';

export interface State {
  orcaAuthenticated: boolean;
  businessAuthenticated: boolean;
  currentUser: User;
}

export const initialState: State = {
  orcaAuthenticated: false,
  businessAuthenticated: false,
  currentUser: null
};

export function AuthReducer(state = initialState, action) {
  // console.log('1111');
  // console.log(state);
  // console.log(action);
  switch (action.type) {

    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        orcaAuthenticated: true,
        currentUser: action.payload
      };

    case authActions.LOGOUT_SUCCESS:
      return {
        ...state,
        orcaAuthenticated: false
      };

    case authActions.SET_CURRENT_USER:
      return {
        ...state,
        orcaAuthenticated: true,
        currentUser: action.payload
      };

    case authActions.DELETE_CURRENT_USER:
      return {
        ...state,
        orcaAuthenticated: false,
        currentUser: null
      };

    case authActions.BUSINESS_LOGIN_SUCCESS:
      return {
        ...state,
        businessAuthenticated: true
      };

    default:
      return state;
  }
}
