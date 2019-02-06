import React, { Component } from 'react';
import {Container, Table} from "reactstrap";
import SectionTitle from "../components/SectionTitle";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {squadService} from "../_services/squad.service";
import SingleRoleSelect from "../components/SingleRoleSelect";
import SquadInviteUser from "../components/SquadInviteUser";
import {alertConstants} from "../_constants/alert.constants";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";

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
        this.removeFromSquad = this.removeFromSquad.bind(this);
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

    removeFromSquad(user, userIndex, squad) {
        squadService.removeUserFromSquad(user.id, squad.id).then(() => {
            this.props.displayAlert(alertConstants.SUCCESS, 'User removed from the squad');
            let squad = {...this.state.squad};
            if(squad.users && squad.users[userIndex]) {
                squad.users.splice(userIndex, 1);
            }
            this.setState({squad});
        }).catch(() => {
            this.props.displayAlert(alertConstants.ERROR, 'Error > User cannot be removed from the squad');
        });
    }

    updateUser(index) {
        if(!this.state.squad.users || this.state.squad.users.length <= index || !this.state.squad.users[index].modified) {
            return;
        }
        const {squad} = this.state;
        const userToUpdate = squad.users[index];
        squadService.updateUserRoleInSquad(userToUpdate.id, squad.id, userToUpdate.role).then(() => {
            const users = this.state.squad.users.slice();
            users[index].modified = false;
            this.setState({users});
        }).catch(() => {
            this.props.displayAlert(alertConstants.ERROR, 'Error > Role not updated');
        });
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
                            <td className='align-middle' onClick={() => this.removeFromSquad(user, index, squad)}>
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedSquadUsers = connect(null, mapDispatchToProps)(SquadUsers);
export default connectedSquadUsers;
