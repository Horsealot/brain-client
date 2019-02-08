import {userService} from "../_services/user.service";

export default function authHeader() {
    // return authorization header with jwt token
    const jwtToken = getAuthToken();

    if (jwtToken) {
        return { 'Authorization': 'Bearer ' + jwtToken };
    } else {
        return {};
    }
}
export function getAuthToken() {
    return localStorage.getItem('userToken');
}
export function setAuthToken(token) {
    return localStorage.setItem('userToken', token);
}

export function squadHeader(squadId) {
    if(squadId) {
        return { 'Brain-squad': squadId };
    }

    let activeSquad = userService.getActiveSquad();

    if (activeSquad && activeSquad.id) {
        return { 'Brain-squad': activeSquad.id };
    } else {
        return {};
    }
}