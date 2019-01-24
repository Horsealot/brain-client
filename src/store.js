import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createBrowserHistory} from 'history';

import rootReducer from './reducers/index';

// import users from './test-data/users';
// import comments from './test-data/users';
//
// // create object for default data
// const defaultState = {
//     loggedUser: {},
//     users,
//     comments
// }

const store = createStore(rootReducer, applyMiddleware(
    thunkMiddleware
));

export const history = createBrowserHistory();

// export const history = syncHistoryWithStore(createBrowserHistory(), store);
// export const history = createMemoryHistory('/')

export default store;