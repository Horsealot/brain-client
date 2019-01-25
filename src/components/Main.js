import React, { Component } from 'react';
import { Router } from "react-router-dom";
import { Route } from "react-router";
import Profile from "./Profile";

import { history } from './../store';
import {LoginPage} from "./LoginPage/LoginPage";
import {SignupPage} from "./SignupPage/SignupPage";
import PasswordRequestPage from "./PasswordRequestPage/PasswordRequestPage";
import PasswordResetPage from "./PasswordResetPage/PasswordResetPage";
import Dashboard from "./Dashboard";
import {PrivateLayoutRoute} from "./PrivateLayouteRoute";
import Members from "./Members";

class Main extends Component {
  render() {
    return (
        <Router history={history}>
            <div className="sans-serif">
                <PrivateLayoutRoute path="/" exact component={Dashboard}/>
                <PrivateLayoutRoute path="/profile/:id" component={Profile} />
                <PrivateLayoutRoute path="/profile" component={Profile} />
                <PrivateLayoutRoute path="/members" component={Members} />

                {/* Auth routes */}
                <Route path="/password/request" component={PasswordRequestPage}/>
                <Route path="/password/reset/:token" component={PasswordResetPage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/signup/:token" component={SignupPage}/>
            </div>
        </Router>
    );
  }
}

export default Main;
