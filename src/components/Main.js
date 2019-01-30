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
import ProfileEdition from "./ProfileEdition";
import Squads from "./Squads";

class Main extends Component {
  render() {
    return (
        <Router history={history}>
            <div className="sans-serif">
                <PrivateLayoutRoute path="/" exact component={Dashboard}/>
                <PrivateLayoutRoute exact path="/profile/:id" component={Profile} />
                <PrivateLayoutRoute path="/profile/:id/edition" component={ProfileEdition} />
                <PrivateLayoutRoute path="/members" component={Members} />
                <PrivateLayoutRoute path="/squads" component={Squads} />

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
