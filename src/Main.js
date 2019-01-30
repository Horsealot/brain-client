import React, { Component } from 'react';
import { Router } from "react-router-dom";
import { Route } from "react-router";
import Profile from "./components/Profile";

import { history } from './store';
import {LoginPage} from "./components/LoginPage/LoginPage";
import {SignupPage} from "./components/SignupPage/SignupPage";
import PasswordRequestPage from "./components/PasswordRequestPage/PasswordRequestPage";
import PasswordResetPage from "./components/PasswordResetPage/PasswordResetPage";
import Dashboard from "./components/Dashboard";
import {PrivateLayoutRoute} from "./components/PrivateLayoutRoute";
import Members from "./components/Members";
import ProfileEdition from "./components/ProfileEdition";
import Squads from "./components/Squads";

class Main extends Component {
  render() {
    return (
        <Router history={history}>
            <div className="sans-serif">
                <PrivateLayoutRoute path="/" exact component={Dashboard}/>
                <PrivateLayoutRoute exact path="/profile/:id" component={Profile} />
                <PrivateLayoutRoute path="/profile/:id/edition" component={ProfileEdition} />
                <PrivateLayoutRoute path="/admin" component={Members} />
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
