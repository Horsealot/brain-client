import React, { Component } from 'react';

import '../_styles/Layout.scss';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";

class MenuLink extends Component {
    render() {
        const {pathname} = this.props.location;
        const { targetUrl, image, icon, caption } = this.props;
        return (
            <Link to={ targetUrl } className={'aside-menu__element flex flex--center-center flex--column' + (pathname === targetUrl ? ' active' : '') } >
                {
                    image && (<img src={ image } alt={caption} />)
                }
                {
                    icon && (<i className={ icon } />)
                }
                <div className="aside-menu__element__title">
                    { caption }
                </div>
            </Link>
        );
    }
}

export default withRouter(MenuLink);
