import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {validateEmail} from "../_helpers/form-validator";
import authHeader, {squadHeader} from "../_helpers/auth-header";
import config from "../config";
import {userService} from "../_services/user.service";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';

class SquadInviteUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            invitedEmail: '',
            invitedMessage: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                headers: { ...authHeader(), ...squadHeader(this.props.squadId), 'Content-Type': 'application/json' },
                body: JSON.stringify({email: invitedEmail})
            };

            return fetch(`${config.apiUrl}/invite`, requestOptions)
                .then(userService.handleResponse)
                .then((data) => {
                    if(data.user) {
                        if(this.props.userAddedToSquad) {
                            this.props.userAddedToSquad(data.user, this.props.squadId);
                        }
                        this.props.displayAlert(alertConstants.SUCCESS, userMessages.SQUAD_INVITE_USER.USER_ADDED);
                    } else {
                        this.props.displayAlert(alertConstants.SUCCESS, userMessages.SQUAD_INVITE_USER.USER_INVITED);
                    }
                    this.setState({invitedEmail: '', invitedMessage: ''});
                }).catch((err) => {
                    if(err === 'Conflict') {
                        this.props.displayAlert(alertConstants.ERROR, userMessages.SQUAD_INVITE_USER.USER_ALREADY_IN);
                    } else {
                        this.props.displayAlert(alertConstants.ERROR, userMessages.SQUAD_INVITE_USER.INTERNAL_ERROR);
                    }
                    this.setState({invitedMessage: ''});
                })
        }
    }

    render() {
        const { submitted, invitedEmail, invitedMessage } = this.state;
        return (
            <Form onSubmit={ this.handleSubmit }>
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
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedSquadInviteUser = connect(null, mapDispatchToProps)(SquadInviteUser);
export default connectedSquadInviteUser;