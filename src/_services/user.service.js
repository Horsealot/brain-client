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
    setActiveSquad,
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
            if(data.user.squads && data.user.squads.length && !getActiveSquad()) {
                setActiveSquad(data.user.squads[0]);
            }
            return data.user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('userToken');
}

function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = response.statusText;
            try {
                const body = JSON.parse(text);
                return Promise.reject({error, details: body.errors});
            } catch(e) {
                return Promise.reject({error});
            }
        }
        return text && JSON.parse(text);
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
    localStorage.setItem('activeSquad', JSON.stringify(newActiveSquad));
}

function switchActiveSquad(newActiveSquad, user) {
    localStorage.setItem('activeSquad', JSON.stringify(newActiveSquad));
    user.activeSquad = newActiveSquad;
    return user;
}