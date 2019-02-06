import React, { Component } from 'react';
import { Container, Table} from "reactstrap";
import SectionTitle from "../components/SectionTitle";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {squadService} from "../_services/squad.service";
import SingleRoleSelect from "../components/SingleRoleSelect";
import SquadInviteUser from "../components/SquadInviteUser";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import NewSquadForm from "../components/NewSquadForm";

import '../_styles/_components/_admin-squad.scss';

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
        this.removeFromSquad = this.removeFromSquad.bind(this);
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

    removeFromSquad(user, userIndex, squad, squadIndex) {
        squadService.removeUserFromSquad(user.id, squad.id).then(() => {
            this.props.displayAlert(alertConstants.SUCCESS, 'User removed from the squad');
            let squads = this.state.squads.slice();
            if(squads[squadIndex] && squads[squadIndex].users && squads[squadIndex].users[userIndex]) {
                squads[squadIndex].users.splice(userIndex, 1);
            }
            this.setState({squads});
        }).catch(() => {
            this.props.displayAlert(alertConstants.ERROR, 'Error > User cannot be removed from the squad');
        });
    }

    updateUser(index, squadIndex) {
        if(!this.state.squads[squadIndex].users || this.state.squads[squadIndex].users.length <= index || !this.state.squads[squadIndex].users[index].modified) {
            return;
        }
        const userToUpdate = this.state.squads[squadIndex].users[index];
        const squadToPush = this.state.squads[squadIndex];

        squadService.updateUserRoleInSquad(userToUpdate.id, squadToPush.id, userToUpdate.role).then(() => {
            const squads = this.state.squads.slice();
            squads[squadIndex].users[index].modified = false;
            this.setState({squads});
        }).catch(() => {
            this.props.displayAlert(alertConstants.ERROR, 'Error > Role not updated');
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
                                        <td className='align-middle' onClick={() => this.removeFromSquad(user, index, squad, squadIndex)}>
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