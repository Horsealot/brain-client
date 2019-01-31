import { userConstants } from './../_constants/user.constants';
import { userService } from './../_services/user.service';
import { alertActions } from './alert.actions';
import { history } from './../store';

export function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

export function signup(token, password, firstname, lastname) {
    return dispatch => {
        userService.signup(token, password, firstname, lastname)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(error(error));
                }
            );
    };

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.SIGNUP_FAILURE, error } }
}

export function updateUser(user) {
    const newUser = userService.updateLocalUser(user);
    return { type: userConstants.USER_UPDATED, user: newUser }
}

export function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}