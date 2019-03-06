import React, { Component } from 'react';

import MenuLink from "./MenuLink";
import ActiveSquadSelection from "./ActiveSquadSelection";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        };
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({opened: !this.state.opened});
    }

    render() {
        const {opened} = this.state;
        return (
            <>
                <i onClick={this.toggleMenu} className="fas fa-bars aside-menu__burger"/>
                <div className={'aside-menu flex flex--start-center flex--column ' + (opened ? ' aside-menu--opened' : '')}>
                    <ActiveSquadSelection />
                    <MenuLink targetUrl="/" icon='brainicon-dashboard' caption="Dashboard"/>
                    <MenuLink targetUrl="/okr" icon='brainicon-okr' caption="OKR's"/>
                    <MenuLink targetUrl="/todo" icon='brainicon-todo' caption="Week todo"/>
                    <MenuLink targetUrl="/tools" icon='brainicon-tools' caption="Tools"/>
                    <div className="flex--grow"></div>
                    <MenuLink targetUrl="/how-to" icon='brainicon-tools' caption="How to"/>
                    <MenuLink targetUrl="/food-for-thought" icon='brainicon-tools' caption="Food for though"/>
                </div>
            </>
        );
    }
}

export default Layout;
