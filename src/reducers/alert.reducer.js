import {alertConstants} from "../_constants/alert.constants";

const initialState = {alerts: []};

export default function authentication(state = initialState, action) {
    let localeAlerts = [...state.alerts];
    switch (action.type) {
        case alertConstants.SUCCESS:
            localeAlerts.unshift({
                id: action.id,
                message: action.message,
                status: alertConstants.SUCCESS
            });
            return {
                alerts: localeAlerts
            };
        case alertConstants.ERROR:
            localeAlerts.unshift({
                id: action.id,
                message: action.message,
                status: alertConstants.ERROR
            });
            return {
                alerts: localeAlerts
            };
        case alertConstants.CLEAR:
            if(typeof action.id !== 'undefined') {
                let index = -1;
                for(let i = 0; i < localeAlerts.length; i++) {
                    if(localeAlerts[i].id === action.id) {
                        index = i;
                    }
                }
                if(index >= 0) {
                    localeAlerts.splice(index, 1);
                    return {
                        alerts: localeAlerts
                    }
                }
                return state;
            }
            return {
                alerts: []
            };
        default:
            return state
    }
}