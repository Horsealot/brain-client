import React, { Component } from 'react';

import MenuLink from "./MenuLink";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user'))
        };
    }

    render() {
        const isAdmin = true;
        return (
            <div className="aside-menu flex flex--start-center flex--column">
                <MenuLink targetUrl="/" icon='brainicon-dashboard' caption="Dashboard"/>
                <MenuLink targetUrl="/okrs" icon='brainicon-okr' caption="OKR's"/>
                <MenuLink targetUrl="/todo" icon='brainicon-todo' caption="Week todo"/>
                <MenuLink targetUrl="/tools" icon='brainicon-tools' caption="Tools"/>
                { isAdmin && (<MenuLink targetUrl="/members" icon='brainicon-tools' caption="Members"/>)}
                <div className="flex--grow"></div>
                <MenuLink targetUrl="/how-to" icon='brainicon-tools' caption="How to"/>
                <MenuLink targetUrl="/food" icon='brainicon-tools' caption="Food for though"/>
            </div>
        );
    }
}

export default Layout;
