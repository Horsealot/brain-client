import { userConstants } from './../_constants/user.constants';

let userToken = localStorage.getItem('userToken');
const initialState = userToken ? { userToken, loaded: false } : {loaded: false};

export default function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loaded: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loaded: true,
                user: action.user
            };
        case userConstants.USER_UPDATED:
            return {
                loaded: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return {
                loaded: true,
                error: userConstants.LOGIN_FAILURE
            };
        case userConstants.SIGNUP_FAILURE:
            return {
                loaded: true,
                error: userConstants.SIGNUP_FAILURE
            };
        case userConstants.LOGOUT:
            return {
                loaded: true
            };
        case userConstants.USER_SWITCH_SQUAD:
            return {
                loaded: true,
                user: action.user
            };
        default:
            return state
    }
}