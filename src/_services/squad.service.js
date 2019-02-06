import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const squadService = {
    removeUserFromSquad,
    updateUserRoleInSquad
};

function removeUserFromSquad(userId, squadId) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), ...squadHeader(squadId), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/users/${userId}/squads`, requestOptions)
        .then(userService.handleResponse);
}

function updateUserRoleInSquad(userId, squadId, role) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), ...squadHeader(squadId), 'Content-Type': 'application/json' },
        body: JSON.stringify({squad: {role}})
    };

    return fetch(`${config.apiUrl}/users/${userId}/squads`, requestOptions)
        .then(userService.handleResponse);
}