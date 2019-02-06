import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import authHeader from "../_helpers/auth-header";
import config from "../config";
import {userService} from "../_services/user.service";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import './../_styles/_components/_new_squad_form.scss';

class NewSquadForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            squadName: '',
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
        const {squadName} = this.state;
        if(!squadName) return;

        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({squad: {name: this.state.squadName}})
        };

        return fetch(`${config.apiUrl}/squads`, requestOptions)
            .then(userService.handleResponse)
            .then((data) => {
                if(data.squad && this.props.squadCreate) {
                    this.props.squadCreate(data.squad);
                }
                this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_SQUAD_FORM.SUCCESS);
                this.setState({squadName: ''});
            }).catch((err) => {
                if(err === 'Conflict') {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.EXISTING);
                } else {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.INTERNAL_ERROR);
                }
            });
    }

    render() {
        const { submitted, squadName } = this.state;
        return (
            <Form className='new-squad-form' onSubmit={ this.handleSubmit }>
                <Row form>
                    <Col md={{ size: 8, offset: 2}}>
                        <FormGroup>
                            <h5>Create new squad</h5>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 5, offset: 2}}>
                        <FormGroup>
                            <FloatingLabelInput
                                type="text"
                                label="Name"
                                formClass={(submitted && !squadName ? 'has-error' : '')}
                                name="squadName" value={squadName}
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 3}} className='text-right'>
                        <FormGroup>
                            <Button className="btn">Create</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedNewSquadForm = connect(null, mapDispatchToProps)(NewSquadForm);
export default connectedNewSquadForm;