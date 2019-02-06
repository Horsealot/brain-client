export default function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
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