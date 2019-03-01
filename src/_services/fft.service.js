import authHeader from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const fftService = {
    getArticles,
    deleteArticle
};

function getArticles() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/food-for-thought`, requestOptions)
        .then(userService.handleResponse);
}

function deleteArticle(articleId) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/food-for-thought/${articleId}`, requestOptions)
        .then(userService.handleResponse);
}