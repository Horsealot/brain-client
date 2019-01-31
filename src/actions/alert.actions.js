import { alertConstants } from './../_constants/alert.constants';

export const alertActions = {
    success,
    error,
    clear
};

export function success(id, message) {
    return { type: alertConstants.SUCCESS, id, message };
}

export function error(id, message) {
    return { type: alertConstants.ERROR, id, message };
}

export function clearSingle(id) {
    return { type: alertConstants.CLEAR, id };
}

export function clear() {
    return { type: alertConstants.CLEAR };
}

let alertId = 0;

export function displayAlert(type, message) {
    return dispatch => {
        if(type === alertConstants.SUCCESS) {
            const id = alertId++;
            dispatch(success(id, message));
            setTimeout(() => {
                dispatch(clearSingle(id))
            }, 5000)
        } else if(type === alertConstants.ERROR) {
            const id = alertId++;
            dispatch(error(id, message));
            setTimeout(() => {
                dispatch(clearSingle(id))
            }, 5000)
        }
    }
}