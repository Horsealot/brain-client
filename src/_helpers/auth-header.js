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
    let activeSquad = JSON.parse(localStorage.getItem('activeSquad'));

    if (activeSquad && activeSquad.id) {
        return { 'Brain-squad': activeSquad.id };
    } else {
        return {};
    }
}