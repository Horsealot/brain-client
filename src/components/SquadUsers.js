import React, { Component } from 'react';
import {Button, Col, Container, Form, FormGroup, Row, Table} from "reactstrap";
import SectionTitle from "./SectionTitle";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FloatingLabelInput from "./FloatingLabelInput";
import {validateEmail} from "../_helpers/form-validator";
import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "../_services/user.service";
import SingleRoleSelect from "./SingleRoleSelect";
import SquadInviteUser from "./SquadInviteUser";

class SquadUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            squad: this.props.data.squad,
            invitedEmail: '',
            invitedMessage: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.remapUser = this.remapUser.bind(this);
        this.addUserToSquad = this.addUserToSquad.bind(this);
    }


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    remapUser(values, index, key) {
        const users = this.state.squad.users.slice();
        if(users.length <= index) return;

        users[index][key] = values;
        users[index].modified = true;
        this.setState({users});
    };

    addUserToSquad(user, squadId) {
        const squad = {...this.state.squad};
        if(squad.id === squadId) {
            squad.users.push(user);
        }
        this.setState({squad});
    }

    updateUser(index) {
        if(!this.state.squad.users || this.state.squad.users.length <= index || !this.state.squad.users[index].modified) {
            return;
        }
        const userToUpdate = this.state.squad.users[index];
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
                const users = this.state.squad.users.slice();
                users[index].modified = false;
                this.setState({users});
            })
    }

    render() {
        const { squad } = this.state;
        return (
            <Container>
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
                                    onBlur={(index) => {this.updateUser(index)}}
                                    onChange={(value, index) => {this.remapUser(value, index, 'role')}}
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
            </Container>
        );
    }
}

export default SquadUsers;
