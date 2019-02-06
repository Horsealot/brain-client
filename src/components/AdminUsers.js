import React, { Component } from 'react';
import { isAdmin, isAdminOfCurrentSquad } from './../_helpers/admin-validator';
import SuperAdminUsers from "./SuperAdminUsers";
import SquadUsers from "./SquadUsers";
import NotAllowed from "./NotAllowed";
import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "../_services/user.service";

class AdminUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isAllowed: false,
            data: [],
            isAdmin: isAdmin(),
            isAdminOfCurrentSquad: isAdminOfCurrentSquad()
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
                this.setState({isLoaded: false})
            });
    }

    render() {
        const { data, isAdmin, isAllowed, isLoaded } = this.state;
        if(isLoaded && isAdmin) {
            return (<SuperAdminUsers data={data}/>);
        } else if(isLoaded && isAllowed) {
            return (<SquadUsers data={data}/>);
        }
        return (<NotAllowed />);
    }
}

export default AdminUsers;
