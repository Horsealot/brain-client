export function getUserPicture(user) {
    if(user.picture) {
        return user.picture;
    }
    return '/assets/images/default-profile.jpg';
}