import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authentication from './authentication.reducer';

const rootReducer = combineReducers({authentication, routing: routerReducer});

export default rootReducer;