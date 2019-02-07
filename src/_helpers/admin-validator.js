export function isAdmin(user) {
    return user.roles && user.roles.indexOf('ADMIN') >= 0;
}

export function isAdminOfRoles(roles) {
    return roles && roles.indexOf('ADMIN') >= 0;
}

export function isAdminOfCurrentSquad() {
    let activeSquad = JSON.parse(localStorage.getItem('activeSquad'));
    return activeSquad ? isAdminOfRoles(activeSquad.role) : false;
}