import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from "./Layout";
import MyProfile from "./MyProfile";
import FullPageLoader from "./FullPageLoader";

export const PrivateLayoutRoute = ({ component: Component, authentication, ...rest }) => (
    <Route {...rest} render={props => {
        if(authentication.loaded) {
            return (
                authentication.user
                    ?
                    <div>
                        <Layout/>
                        <div className="main-container">
                            <Component {...props} />
                            <MyProfile/>
                        </div>
                    </div>
                    : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
        }

        return (<FullPageLoader />);
    }} />
);