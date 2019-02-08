import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const toolService = {
    getTools,
    createCategory,
    createTool
};

function getTools() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/tools`, requestOptions)
        .then(userService.handleResponse);
}

function createCategory(name, squad) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({category: {name}})
    };
    if(squad) {
        requestOptions.body = JSON.stringify({category: {name, squadId: squad.id}});
    }

    return fetch(`${config.apiUrl}/tools/category`, requestOptions)
        .then(userService.handleResponse);
}

function createTool(categoryId, name, link, icon) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({tool: {categoryId, name, link, icon}})
    };

    return fetch(`${config.apiUrl}/tools`, requestOptions)
        .then(userService.handleResponse);
}