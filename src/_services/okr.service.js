import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const okrService = {
    getOkr,
    createOkr,
    getPastOkrs
};

function getOkr() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/okrs`, requestOptions)
        .then(userService.handleResponse);
}

function getPastOkrs() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/okrs/past`, requestOptions)
        .then(userService.handleResponse);
}

function createOkr(okr, forBrain) {
    let requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({okr})
    };
    if(forBrain) {
        requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({okr})
        };
    }
    const link = okr.id ? `${config.apiUrl}/okrs/${okr.id}` : `${config.apiUrl}/okrs`;

    return fetch(link, requestOptions)
        .then(userService.handleResponse);
}