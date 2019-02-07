import { userConstants } from './../_constants/user.constants';
import { userService } from './../_services/user.service';
import { history } from './../store';

export function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    history.push('/');
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
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
                }
            );
    };

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.SIGNUP_FAILURE, error } }
}

export function loadMyUser() {
    return dispatch => {
        userService.loadMyUser()
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    history.push('/login');
                    dispatch(failure(error));
                }
            );
    };

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

export function updateUser(user) {
    return { type: userConstants.USER_UPDATED, user: user };
}

export function switchSquad(user, activeSquad) {
    return {
        type: userConstants.USER_SWITCH_SQUAD,
        user: userService.switchActiveSquad(activeSquad, user),
    };
}

export function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}