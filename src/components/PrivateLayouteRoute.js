import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from "./Layout";

export const PrivateLayoutRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ?
            <div>
                <Layout/>
                <div className="main-container">
                    <Component {...props} />
                </div>
            </div>
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)