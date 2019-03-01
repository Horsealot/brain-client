import React, { Component } from 'react';

import MenuLink from "./MenuLink";
import ActiveSquadSelection from "./ActiveSquadSelection";

class Layout extends Component {

    render() {
        return (
            <div className="aside-menu flex flex--start-center flex--column">
                <ActiveSquadSelection />
                <MenuLink targetUrl="/" icon='brainicon-dashboard' caption="Dashboard"/>
                <MenuLink targetUrl="/okr" icon='brainicon-okr' caption="OKR's"/>
                <MenuLink targetUrl="/todo" icon='brainicon-todo' caption="Week todo"/>
                <MenuLink targetUrl="/tools" icon='brainicon-tools' caption="Tools"/>
                <div className="flex--grow"></div>
                <MenuLink targetUrl="/how-to" icon='brainicon-tools' caption="How to"/>
                <MenuLink targetUrl="/food-for-thought" icon='brainicon-tools' caption="Food for though"/>
            </div>
        );
    }
}

export default Layout;
