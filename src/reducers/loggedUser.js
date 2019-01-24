// A reducer takes 2 things


// 1. The action
// 2. copy of current state

function loggedUser(state = [], action) {
    switch(action.type) {
        case 'LOGGED_IN':
        default:
            return state;
    }
}

export default loggedUser;