import { userService } from './../_services/user.service';

import { history } from './../store';

// Increment like user
export function incrementUserLike(index) {
    return {
        type: 'INCREMENT_USER_LIKE',
        index: index
    }
}

// Add comment
export function addComment(userId, author, comment) {
    return {
        type: 'ADD_COMMENT',
        userId,
        author,
        comment
    }
}

// Remove comment
export function removeComment(userId, index) {
    return {
        type: 'REMOVE_COMMENT',
        userId,
        index
    }
}

// Logout
export function logout() {
    userService.logout();
    return { type: 'LOGOUT' };
}

export function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: 'LOGIN_REQUEST', user } }
    function success(user) { return { type: 'LOGIN_SUCCESS', user } }
    function failure(error) { return { type: 'LOGIN_FAILURE', error } }
}