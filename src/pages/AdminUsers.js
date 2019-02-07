import React, { Component } from 'react';
import { isAdmin } from '../_helpers/admin-validator';
import SuperAdminUsers from "./SuperAdminUsers";
import SquadUsers from "./SquadUsers";
import NotAllowed from "../components/NotAllowed";
import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "../_services/user.service";
import connect from "react-redux/es/connect/connect";
import FullPageLoader from "../components/FullPageLoader";

class AdminUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isAllowed: false,
            data: [],
            isAdmin: isAdmin(this.props.authentication.user)
        };
    }

    componentDidMount() {
        let requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };
        if(!this.state.isAdmin) {
            requestOptions.headers = { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' };
        }
        return fetch(`${config.apiUrl}/users`, requestOptions)
            .then(userService.handleResponse)
            .then((data) => {
                this.setState({data, isLoaded: true, isAllowed: true});
            }).catch(() => {
                this.setState({isLoaded: true, isAllowed: false})
            });
    }

    render() {
        const { data, isAdmin, isAllowed, isLoaded } = this.state;
        if(!isLoaded) {
            return (<FullPageLoader />);
        }
        if(isAdmin) {
            return (<SuperAdminUsers data={data}/>);
        } else if(isAllowed) {
            return (<SquadUsers data={data}/>);
        }
        return (<NotAllowed />);
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedAdminUsers = connect(mapStateToProps, null)(AdminUsers);
export default connectedAdminUsers;
