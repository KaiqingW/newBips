import * as fromAuthReducer from '../reducers/auth.reducer';

export interface StoreState {
  auth: fromAuthReducer.State;
}
