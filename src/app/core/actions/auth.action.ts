import { Action } from '@ngrx/store';
import { User } from '../models/user';

export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGOUT_SUCCESS = '[Auth] Logout Success';
export const SET_CURRENT_USER = '[Auth] Set Current User';
export const DELETE_CURRENT_USER = '[Auth] Delete Current User';
export const BUSINESS_LOGIN_SUCCESS = '[Auth] BUSINESS LOGIN SUCCESS';

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: User) {}
}

export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
  constructor() {}
}

export class SetCurrentUser implements Action {
  readonly type = SET_CURRENT_USER;
  constructor(public payload: User) {}
}

export class DeleteCurrentUser implements Action {
  readonly type = DELETE_CURRENT_USER;
  constructor(public payload: User) {}
}

export class BusinessLoginSuccess implements Action {
  readonly type = BUSINESS_LOGIN_SUCCESS;
  constructor(public payload: User) {}
}
