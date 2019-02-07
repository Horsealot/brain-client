import config from './../config';
import authHeader from './../_helpers/auth-header';
import {setAuthToken} from "../_helpers/auth-header";

export const userService = {
    login,
    signup,
    logout,
    handleResponse,
    updateUser,
    getUser,
    getActiveSquad,
    getActiveSquadName,
    switchActiveSquad,
    loadMyUser
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
            setAuthToken(data.user.token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log(getActiveSquad());
            if(data.user.squads && data.user.squads.length && !getActiveSquad()) {
                setActiveSquad(data.user.squads[0]);
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
            setAuthToken(data.user.token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if(data.user.squads && data.user.squads.length && !getActiveSquad()) {
                setActiveSquad(data.user.squads[0]);
            }

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

function getUser(userId) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/users/${userId}`, requestOptions)
        .then(handleResponse)
        .then((data) => {
            return data;
        });
}

function loadMyUser() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/me`, requestOptions)
        .then(handleResponse)
        .then((data) => {
            console.log(getActiveSquad());
            if(data.user.squads && data.user.squads.length && !getActiveSquad()) {
                console.log(1);
                setActiveSquad(data.user.squads[0]);
            }
            return data.user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('userToken');
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

function getActiveSquadName() {
    const activeSquad = getActiveSquad();
    return (activeSquad && activeSquad.name) ? activeSquad && activeSquad.name : "";
}

function getActiveSquad() {
    return JSON.parse(localStorage.getItem('activeSquad'));
}

function setActiveSquad(newActiveSquad) {
    console.log(newActiveSquad);
    localStorage.setItem('activeSquad', JSON.stringify(newActiveSquad));
}

function switchActiveSquad(newActiveSquad, user) {
    localStorage.setItem('activeSquad', JSON.stringify(newActiveSquad));
    user.activeSquad = newActiveSquad;
    return user;
}