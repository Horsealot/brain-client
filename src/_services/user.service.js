import config from './../config';
import authHeader from './../_helpers/auth-header';

export const userService = {
    login,
    signup,
    logout,
    handleResponse,
    updateLocalUser
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user: { email, password }})
    };

    return fetch(`${config.apiUrl}/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(data.user));

            return data.user;
        });
}

function signup(token, password, firstname, lastname) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user: { token, password, firstname, lastname }})
    };

    return fetch(`${config.apiUrl}/signup`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(data.user));

            return data.user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function updateLocalUser(user) {
    localStorage.setItem('user', JSON.stringify({...JSON.parse(localStorage.getItem('user')), ...user}));
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        const data = text && JSON.parse(text);
        return data;
    });
}