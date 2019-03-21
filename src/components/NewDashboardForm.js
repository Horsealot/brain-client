import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import './../_styles/_components/_new_squad_form.scss';
import {dashboardService} from "../_services/dashboard.service";

class NewDashboardForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
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
        const {name} = this.state;
        if(!name) return;


        dashboardService.createSquadDashboard(name).then((data) => {
            this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_DASHBOARD_FORM.SUCCESS);
            if(typeof this.props.onCreated === 'function') {
                this.props.onCreated();
            }
        }).catch((err) => {
            if(err === 'Conflict') {
                this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_DASHBOARD_FORM.EXISTING);
            } else {
                this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_DASHBOARD_FORM.INTERNAL_ERROR);
            }
        });
    }

    render() {
        const { submitted, name } = this.state;
        return (
            <Form className='new-dashboard-form' onSubmit={ this.handleSubmit }>
                <Row form>
                    <Col md={{ size: 8, offset: 2}}>
                        <FormGroup>
                            <h5>Create new dashboard</h5>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 5, offset: 2}}>
                        <FormGroup>
                            <FloatingLabelInput
                                type="text"
                                label="Name"
                                formClass={(submitted && !name ? 'has-error' : '')}
                                name="name" value={name}
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

const connectedNewDashboardForm = connect(null, mapDispatchToProps)(NewDashboardForm);
export default connectedNewDashboardForm;