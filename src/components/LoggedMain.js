import React, { Component } from 'react';
import {Route} from "react-router";
import ProfilePhoto from "./ProfilePhoto";
import Dashboard from "./Dashboard";

class LoggedMain extends Component {
    render() {
        return (
            <div className="sans-serif">
                <Route path="/" exact component={Dashboard} />
                <Route path="/two" exact component={ProfilePhoto} />
            </div>
        );
    }
}

export default LoggedMain;
