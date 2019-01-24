// A reducer takes 2 things


// 1. The action
// 2. copy of current state

function comments(state = [], action) {
    console.log(action);
    return state;
}

export default comments;