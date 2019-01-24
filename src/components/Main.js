import React, { Component } from 'react';
import logo from './../logo.svg';
import '../_styles/App.scss';
import { Router } from "react-router-dom";
import { Route } from "react-router";
import Profile from "./Profile";

import { history } from './../store';
import {PrivateRoute} from "./PrivateRoute";
import {LoginPage} from "./LoginPage/LoginPage";
import PasswordRequestPage from "./PasswordRequestPage/PasswordRequestPage";
import PasswordResetPage from "./PasswordResetPage/PasswordResetPage";
import Dashboard from "./Dashboard";
import {PrivateLayoutRoute} from "./PrivateLayouteRoute";

class Main extends Component {
  render() {
    return (
        <Router history={history}>
            <div className="sans-serif">
                <PrivateLayoutRoute path="/" exact loggedUser={this.props.loggedUser} component={Dashboard}/>
                <PrivateLayoutRoute path="/profile/:id" members={this.props.users} comments={this.props.comments} component={Profile} />
                <PrivateLayoutRoute path="/profile" members={this.props.users} comments={this.props.comments} component={Profile} />

                {/* Auth routes */}
                <Route path="/password/request" component={PasswordRequestPage}/>
                <Route path="/password/:token" component={PasswordResetPage}/>
                <Route path="/login" component={LoginPage}/>
            </div>
        </Router>
    );
  }
}

export default Main;
