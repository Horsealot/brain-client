import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';


import users from './users';
import comments from './comments';
import loggedUser from './loggedUser';

const rootReducer = combineReducers({users, comments, loggedUser, routing: routerReducer});

export default rootReducer;