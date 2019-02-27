import authHeader from "../_helpers/auth-header";
import config from "../config";
import {userService} from "./user.service";

export const uploadService = {
    uploadPicture,
    uploadProfilePicture
};

function uploadPicture(pictureData) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader()},
        body: pictureData
    };

    return fetch(`${config.apiUrl}/uploads/picture`, requestOptions)
        .then(userService.handleResponse);
}

function uploadProfilePicture(pictureData) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader()},
        body: pictureData
    };

    return fetch(`${config.apiUrl}/uploads/profile`, requestOptions)
        .then(userService.handleResponse);
}