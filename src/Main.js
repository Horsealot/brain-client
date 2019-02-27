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
import {bindActionCreators} from "redux";
import {loadMyUser, logout} from "./actions/user.actions";
import connect from "react-redux/es/connect/connect";
import Tools from "./pages/Tools";
import Dashboards from "./pages/Dashboards";
import Okrs from "./pages/Okrs";
import PastOkrs from "./pages/PastOkrs";

class Main extends Component {
    constructor(props) {
        super(props);
        if(this.props.authentication.userToken) {
            if(!this.props.authentication.loaded) {
                this.props.loadMyUser();
            }
        } else if(!this.props.authentication.loaded){
            this.props.logout();
        }
    }

    render() {
        return (
            <Router history={history}>
                <div className="sans-serif">
                    <PrivateLayoutRoute path="/" exact component={Dashboard} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute path="/dashboards/:id" exact component={Dashboards} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute exact path="/profile/:id" component={Profile} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute path="/profile/:id/edition" component={ProfileEdition} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute exact path="/okr" component={Okrs} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute path="/okr/history" component={PastOkrs} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute path="/admin" component={AdminUsers} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute path="/squads" component={Squads} authentication={this.props.authentication}/>
                    <PrivateLayoutRoute path="/tools" component={Tools} authentication={this.props.authentication}/>

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


function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadMyUser, logout }, dispatch);
}

const connectedMain = connect(mapStateToProps, mapDispatchToProps)(Main);
export default connectedMain;
