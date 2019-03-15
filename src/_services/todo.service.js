import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const todoService = {
    getTodo,
};

function getTodo() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/todo`, requestOptions)
        .then(userService.handleResponse);
}