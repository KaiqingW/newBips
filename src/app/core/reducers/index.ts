import { ActionReducerMap } from '@ngrx/store';
import { StoreState } from '../models/store-state';

import { AuthReducer } from './auth.reducer';

export const reducers: ActionReducerMap<StoreState> = {
    
    auth: AuthReducer
};
