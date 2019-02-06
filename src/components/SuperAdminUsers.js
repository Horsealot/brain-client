import React, { Component } from 'react';
import { Container, Table} from "reactstrap";
import SectionTitle from "./SectionTitle";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "../_services/user.service";
import SingleRoleSelect from "./SingleRoleSelect";
import SquadInviteUser from "./SquadInviteUser";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import NewSquadForm from "./NewSquadForm";

import './../_styles/_components/_admin-squad.scss';

class SuperAdminUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            squads: this.props.data.squads,
        };

        this.handleChange = this.handleChange.bind(this);
        this.remapUser = this.remapUser.bind(this);
        this.addUserToSquad = this.addUserToSquad.bind(this);
        this.addNewSquad = this.addNewSquad.bind(this);
    }


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    remapUser(values, index, key, squadIndex) {
        const users = this.state.squads[squadIndex].users.slice();
        if(users.length <= index) return;

        users[index][key] = values;
        users[index].modified = true;
        this.setState({users});
    };

    addUserToSquad(user, squadId) {
        const squads = this.state.squads.slice();
        squads.forEach((squad) => {
            if(squad.id === squadId) {
                squad.users.push(user);
            }
        });
        this.setState({squads});
    }

    addNewSquad(squad) {
        const squads = this.state.squads.slice();
        squad.users = [];
        squads.push(squad);
        this.setState({squads});
    }

    updateUser(index, squadIndex) {
        if(!this.state.squads[squadIndex].users || this.state.squads[squadIndex].users.length <= index || !this.state.squads[squadIndex].users[index].modified) {
            return;
        }
        const userToUpdate = this.state.squads[squadIndex].users[index];
        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), ...squadHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: {
                    role: userToUpdate.role,
                }
            })
        };

        return fetch(`${config.apiUrl}/users/${userToUpdate.id}`, requestOptions)
            .then(userService.handleResponse)
            .then((data) => {
                if(!data || !data.user || !data.user['role'] || data.user['role'] !== 'updated') {
                    this.props.displayAlert(alertConstants.ERROR, 'Error > Role not updated');
                }
                const squads = this.state.squads.slice();
                squads[squadIndex].users[index].modified = false;
                this.setState({squads});
            });
    }

    render() {
        const { squads } = this.state;
        return (
            <Container>
                {
                    squads.map((squad, squadIndex) => (
                        <div className='admin-squad' key={squad.name}>
                            <SectionTitle title={squad.name}/>
                            <Table>
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Joined</th>
                                    <th scope="col"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {squad.users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className='align-middle'>
                                            <Link to={'/profile/' + user.id }>{ user.firstname } { user.lastname }</Link>
                                        </td>
                                        <td className='align-middle' style={{width: '30%'}}>
                                            <SingleRoleSelect
                                                selectKey={index}
                                                value={user.role}
                                                onBlur={(index) => {this.updateUser(index, squadIndex)}}
                                                onChange={(value, index) => {this.remapUser(value, index, 'role', squadIndex)}}
                                            />
                                        </td>
                                        <td className='align-middle'></td>
                                        <td className='align-middle'>
                                            <FontAwesomeIcon icon="trash-alt" />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <SquadInviteUser
                                userAddedToSquad={this.addUserToSquad}
                                squadId={squad.id}
                            />
                        </div>
                    ))
                }
                <NewSquadForm
                    squadCreate={this.addNewSquad}/>
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedSuperAdminUsers = connect(null, mapDispatchToProps)(SuperAdminUsers);
export default connectedSuperAdminUsers;