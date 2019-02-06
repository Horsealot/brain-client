import config from './../config';
import authHeader, {squadHeader} from './../_helpers/auth-header';

export const userService = {
    login,
    signup,
    logout,
    handleResponse,
    updateUser,
    updateLocalUser,
    getCurrentSquadName,
    switchActiveSquad,
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
            if(data.user.squads && data.user.squads.length) {
                localStorage.setItem('activeSquad', JSON.stringify(data.user.squads[0]));
            }

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

function updateUser(user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({user})
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions)
        .then(handleResponse)
        .then((data) => {
            return data;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function updateLocalUser(user) {
    const newUser = {...JSON.parse(localStorage.getItem('user')), ...user};
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
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

function getCurrentSquadName() {
    const currentSquad = JSON.parse(localStorage.getItem('activeSquad'));
    return (currentSquad && currentSquad.name) ? currentSquad && currentSquad.name : "";
}

function switchActiveSquad(newActiveSquad) {
    localStorage.setItem('activeSquad', JSON.stringify(newActiveSquad));
    let user = JSON.parse(localStorage.getItem('user'));
    user.activeSquad = newActiveSquad;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}