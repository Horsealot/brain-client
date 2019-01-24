import React, { Component } from 'react';

import '../_styles/Layout.scss';
import MenuLink from "./MenuLink";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')).user
        };
    }

    render() {
        return (
            <div className="aside-menu flex flex--start-center flex--column">
                <MenuLink targetUrl="/" icon='brainicon-dashboard' caption="Dashboard"/>
                <MenuLink targetUrl="/okrs" icon='brainicon-okr' caption="OKR's"/>
                <MenuLink targetUrl="/todo" icon='brainicon-todo' caption="Week todo"/>
                <MenuLink targetUrl="/tools" icon='brainicon-tools' caption="Tools"/>
                <div className="flex--grow"></div>
                <MenuLink targetUrl="/how-to" icon='brainicon-tools' caption="How to"/>
                <MenuLink targetUrl="/food" icon='brainicon-tools' caption="Food for though"/>
            </div>
        );
    }
}

export default Layout;
