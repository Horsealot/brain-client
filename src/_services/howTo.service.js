import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const howToService = {
    get,
    postHowTo,
    deleteHowTo
};

function get() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/how-to`, requestOptions)
        .then(userService.handleResponse);
}

function postHowTo(howTo, forSquad) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({howTo})
    };
    if(forSquad) {
        let activeSquad = userService.getActiveSquad();
        if(!activeSquad) {
            throw new Error("No active squad");
        }
        if(activeSquad) {
            requestOptions.body = JSON.stringify({howTo: {...howTo, squadId: activeSquad.id}});
        }
    }

    return fetch(`${config.apiUrl}/how-to`, requestOptions)
        .then(userService.handleResponse);
}

function deleteHowTo(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/how-to/${id}`, requestOptions)
        .then(userService.handleResponse);
}