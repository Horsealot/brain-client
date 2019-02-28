import authHeader from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const goalService = {
    getMyGoals,
    addGoal,
    deleteGoal,
    updateGoal
};

function getMyGoals() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/goals`, requestOptions)
        .then(userService.handleResponse);
}

function addGoal(goal) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({goal})
    };

    return fetch(`${config.apiUrl}/goals`, requestOptions)
        .then(userService.handleResponse);
}

function updateGoal(id, goal) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({goal})
    };

    return fetch(`${config.apiUrl}/goals/${id}`, requestOptions)
        .then(userService.handleResponse);
}

function deleteGoal(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/goals/${id}`, requestOptions)
        .then(userService.handleResponse);
}
