export function isAdmin(user) {
    return user.roles && user.roles.indexOf('ADMIN') >= 0;
}
export function isAdminOrSquadAdmin(user) {
    return isAdmin(user) || isAdminOfCurrentSquad(user);
}

export function isAdminOfRoles(roles) {
    return roles && roles.indexOf('ADMIN') >= 0;
}

export function isAdminOfSquad(squad) {
    return squad.role && squad.role === 'ADMIN';
}

export function isAdminOfCurrentSquad(user) {
    let activeSquad = JSON.parse(localStorage.getItem('activeSquad'));
    if(!activeSquad || !Array.isArray(user.squads)) return false;
    let isAdmin = false;
    user.squads.forEach((squad) => {
        if(squad.id === activeSquad.id && isAdminOfSquad(squad)) {
            isAdmin = true;
        }
    })
    return isAdmin;
}