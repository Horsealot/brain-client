import React, { Component } from 'react';
import { Router } from "react-router-dom";
import { Route } from "react-router";
import Profile from "./components/Profile";

import { history } from './store';
import {LoginPage} from "./pages/LoginPage";
import {SignupPage} from "./pages/SignupPage";
import PasswordRequestPage from "./pages/PasswordRequestPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import Dashboard from "./components/Dashboard";
import {PrivateLayoutRoute} from "./components/PrivateLayoutRoute";
import ProfileEdition from "./components/ProfileEdition";
import Squads from "./components/Squads";
import Alerts from "./components/Alerts";
import AdminUsers from "./pages/AdminUsers";

class Main extends Component {
  render() {
    return (
        <Router history={history}>
            <div className="sans-serif">
                <PrivateLayoutRoute path="/" exact component={Dashboard}/>
                <PrivateLayoutRoute exact path="/profile/:id" component={Profile} />
                <PrivateLayoutRoute path="/profile/:id/edition" component={ProfileEdition} />
                <PrivateLayoutRoute path="/admin" component={AdminUsers} />
                <PrivateLayoutRoute path="/squads" component={Squads} />

                {/* Auth routes */}
                <Route path="/password/request" component={PasswordRequestPage}/>
                <Route path="/password/reset/:token" component={PasswordResetPage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/signup/:token" component={SignupPage}/>
                <Alerts/>
            </div>
        </Router>
    );
  }
}


export default Main;
