import React, { Component } from 'react';

import {getUserPicture} from "../_helpers/user-picture";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {isAdminOrSquadAdmin} from "../_helpers/admin-validator";

class MyProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: isAdminOrSquadAdmin(this.props.authentication.user),
            toggleMenu: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        const { toggleMenu } = this.state;
        this.setState({toggleMenu: !toggleMenu});
    }

    render() {
        const { toggleMenu, isAdmin } = this.state;
        const { user } = this.props.authentication;
        return (
            user ?
            <div className='my-profile'>
                <img className='my-profile__picture' alt={user.firstname} onClick={this.toggleMenu} src={getUserPicture(user)}/>
                <div className={(toggleMenu ? 'open' : '') + ' my-profile__menu flex flex--column'}>
                    <Link to={`/profile/${user.id}`} className='my-profile__menu__link'>My profile</Link>
                    <Link to={`/squads`} className='my-profile__menu__link'>Team faces</Link>
                    <Link to={`/login`} className='my-profile__menu__link'>Logout</Link>
                    { isAdmin &&
                        <Link to={`/admin`} className='my-profile__menu__link'>Admin</Link>
                    }
                </div>
            </div>
                :
                <></>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedMyProfile = connect(mapStateToProps, null)(MyProfile);
export default connectedMyProfile;