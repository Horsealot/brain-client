import React, { Component } from 'react';
import config from "../config";
import {Button, Col, Container, Form, FormGroup, Row, Table} from "reactstrap";
import authHeader from "../_helpers/auth-header";
import { userService } from './../_services/user.service';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FloatingLabelInput from "./FloatingLabelInput";
import { validateEmail } from "../_helpers/form-validator";
import {Link} from "react-router-dom";
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated';
import { multiSelectStyle } from './../_styles/_select';
import SectionTitle from "./SectionTitle";
import SquadSelect from "./SquadSelect";
import RoleSelect from "./RoleSelect";

class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            invitedEmail: '',
            invitedMessage: '',
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.remapUser = this.remapUser.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {invitedEmail} = this.state;
        if(!invitedEmail) return;

        if(!validateEmail(invitedEmail)) {
            this.setState({invitedMessage: "Invalid email"})
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({email: this.state.invitedEmail})
            };

            return fetch(`${config.apiUrl}/invite`, requestOptions)
                .then(userService.handleResponse)
                .then(() => {
                    this.setState({invitedMessage: "User invited !"})
                })
        }
    }

    remapUser(values, index, key) {
        const users = this.state.users.slice();
        if(users.length <= index) return;

        users[index][key] = values;
        users[index].modified = true;
        this.setState({users});
    };

    updateUser(index) {
        if(this.state.users.length <= index || !this.state.users[index].modified) {
            return;
        }
        const userToUpdate = this.state.users[index];
        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: {
                    roles: userToUpdate.roles,
                    squads: userToUpdate.squads
                }
            })
        };

        return fetch(`${config.apiUrl}/users/${userToUpdate.id}`, requestOptions)
            .then(userService.handleResponse)
            .then((data) => {
                const users = this.state.users.slice();
                users[index].modified = false;
                this.setState({users});
            })
    }

    componentDidMount() {
            const requestOptions = {
                method: 'GET',
                headers: { ...authHeader(), 'Content-Type': 'application/json' }
            };

            return fetch(`${config.apiUrl}/users`, requestOptions)
                .then(userService.handleResponse)
                .then((data) => {
                    this.setState({users: data.users.map((user) => {return {...user, modified: false}}), usersWaitingToUpdate: []});
                })
    }

    render() {
        const { users, submitted, invitedEmail, invitedMessage } = this.state;
        return (
            <Container>
                <SectionTitle title='Brain members'/>
                <Table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Squads</th>
                            <th scope="col">Roles</th>
                            <th scope="col">Joined</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td className='align-middle'>
                                <Link to={'/profile/' + user.id }>{ user.firstname } { user.lastname }</Link>
                            </td>
                            <td className='align-middle' style={{width: '30%'}}>
                                <SquadSelect
                                    selectKey={index}
                                    value={user.squads}
                                    onBlur={(index) => {this.updateUser(index)}}
                                    onChange={(value, index) => {this.remapUser(value, index, 'squads')}}
                                />
                                {/*<Select*/}
                                    {/*closeMenuOnSelect={false}*/}
                                    {/*components={makeAnimated()}*/}
                                    {/*defaultValue={this.mapUserList(user.squads, squadOptions)}*/}
                                    {/*isMulti*/}
                                    {/*options={squadOptions}*/}
                                    {/*styles={multiSelectStyle}*/}
                                    {/*onChange={(e) => this.remapUserSquads(e, index)}*/}
                                    {/*onBlur={() => this.updateUser(index)}*/}
                                {/*/>*/}
                            </td>
                            <td className='align-middle' style={{width: '30%'}}>
                                <RoleSelect
                                    selectKey={index}
                                    value={user.roles}
                                    onBlur={(index) => {this.updateUser(index)}}
                                    onChange={(value, index) => {this.remapUser(value, index, 'roles')}}
                                />
                                {/*<Select*/}
                                    {/*closeMenuOnSelect={false}*/}
                                    {/*components={makeAnimated()}*/}
                                    {/*defaultValue={this.mapUserList(user.roles, rolesOptions)}*/}
                                    {/*isMulti*/}
                                    {/*options={rolesOptions}*/}
                                    {/*styles={multiSelectStyle}*/}
                                    {/*onChange={(e) => this.remapUserRoles(e, index)}*/}
                                    {/*onBlur={() => this.updateUser(index)}*/}
                                {/*/>*/}
                            </td>
                            <td className='align-middle'></td>
                            <td className='align-middle'>
                                <FontAwesomeIcon icon="trash-alt" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Form onSubmit={this.handleSubmit} style={{ marginTop: '50px' }}>
                    <Row form>
                        <Col md={{ size: 5, offset: 5 }}>
                            <FormGroup>
                                <h5>Invite a new user</h5>
                            </FormGroup>
                        </Col>
                        <Col md={{ size: 5, offset: 5 }}>
                            <FormGroup>
                                <FloatingLabelInput
                                    type="text"
                                    label="Email"
                                    formClass={(submitted && !invitedEmail ? 'has-error' : '')}
                                    name="invitedEmail" value={invitedEmail}
                                    onChange={this.handleChange}/>
                            </FormGroup>
                        </Col>
                        <Col md={2} className='text-right'>
                            <FormGroup>
                                <Button className="btn">Invite</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ size: 6, offset: 6 }} className='text-right'>
                            { invitedMessage }
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}

export default Members;
