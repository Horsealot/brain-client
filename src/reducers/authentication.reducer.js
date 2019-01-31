import { userConstants } from './../_constants/user.constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export default function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.USER_UPDATED:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return {
                error: userConstants.LOGIN_FAILURE
            };
        case userConstants.SIGNUP_FAILURE:
            return {
                error: userConstants.SIGNUP_FAILURE
            };
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}