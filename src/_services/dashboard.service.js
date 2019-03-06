import config from './../config';
import authHeader, {squadHeader} from './../_helpers/auth-header';
import {setAuthToken} from "../_helpers/auth-header";
import {userService} from "./user.service";

export const dashboardService = {
    getMyDashboard,
    getDashboard,
    getAvailableKpis,
    addModuleToDashboard,
    removeModuleToDashboard
};


function getMyDashboard() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/dashboards/my`, requestOptions)
        .then(userService.handleResponse)
        .then((data) => {
            return data;
        });
}

function getDashboard(id) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/dashboards/${id}`, requestOptions)
        .then(userService.handleResponse)
        .then((data) => {
            return data;
        });
}

function addModuleToDashboard(id, module) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({module})
    };

    return fetch(`${config.apiUrl}/dashboards/${id}/module`, requestOptions)
        .then(userService.handleResponse)
        .then((data) => {
            return data;
        });
}

function removeModuleToDashboard(id, moduleId) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/dashboards/${id}/module/${moduleId}`, requestOptions)
        .then(userService.handleResponse)
        .then((data) => {
            return data;
        });
}

function getAvailableKpis() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/dashboards/kpis`, requestOptions)
        .then(userService.handleResponse)
        .then((data) => {
            return data;
        });
}
