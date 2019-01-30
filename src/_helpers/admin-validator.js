export function isAdmin() {
    let user = JSON.parse(localStorage.getItem('user'));
    return user.roles && user.roles.indexOf('ADMIN') >= 0;
}