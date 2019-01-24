import React, { Component } from 'react';

import '../_styles/Layout.scss';
import {Link} from "react-router-dom";

class MenuLink extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link to={ this.props.targetUrl } className="aside-menu__element flex flex--center-center flex--column">
                {
                    this.props.image && (<img src={ this.props.image }/>)
                }
                {
                    this.props.icon && (<i className={this.props.icon} />)
                }
                <div className="aside-menu__element__title">
                    { this.props.caption }
                </div>
            </Link>
        );
    }
}

export default MenuLink;
