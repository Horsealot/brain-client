import React, { Component } from 'react';

import { isAdmin } from "../_helpers/admin-validator";
import {getUserPicture} from "../_helpers/user-picture";
import {Link} from "react-router-dom";
import {history} from "../store";

class MyProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            isAdmin: isAdmin(),
            toggleMenu: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        const { toggleMenu } = this.state;
        this.setState({toggleMenu: !toggleMenu});
    }

    render() {
        const { user, toggleMenu, isAdmin } = this.state;
        return (
            <div className='my-profile'>
                <img className='my-profile__picture' onClick={this.toggleMenu} src={getUserPicture(user)}/>
                <div className={(toggleMenu ? 'open' : '') + ' my-profile__menu flex flex--column'}>
                    <Link to={`/profile/${user._id}`} className='my-profile__menu__link'>My profile</Link>
                    <Link to={`/squads`} className='my-profile__menu__link'>Team faces</Link>
                    <Link to={`/login`} className='my-profile__menu__link'>Logout</Link>
                    { isAdmin &&
                        <Link to={`/admin`} className='my-profile__menu__link'>Admin</Link>
                    }
                </div>
            </div>
        );
    }
}

export default MyProfile;