import React, { Component } from 'react';

import connect from "react-redux/es/connect/connect";
import {alertConstants} from "./../_constants/alert.constants";

class Alerts extends Component {
    render() {
        return (
            <div className='alerts'>
                {
                    this.props.alert.alerts.map((alert) => (
                        <div key={alert.id} className={'alert ' + (alert.status === alertConstants.SUCCESS ? 'alert-success' : 'alert-error')}>
                            {alert.message}
                        </div>
                    ))
                }
           </div>);
    }
}


function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedAlerts = connect(mapStateToProps, null)(Alerts);

export default connectedAlerts;
