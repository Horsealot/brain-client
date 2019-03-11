import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import './../_styles/_components/_new_squad_form.scss';
import {toolService} from "../_services/tool.service";
import {isAdminOrSquadAdmin} from "../_helpers/admin-validator";
import {userService} from "../_services/user.service";

class NewToolCategoryForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            submitted: false,
            forSquad: false,
            activeSquad: userService.getActiveSquad(),
            isAdmin: isAdminOrSquadAdmin(this.props.authentication.user)
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
        const squad = (this.state.isAdmin && this.state.forSquad) ? this.state.activeSquad : null;

        return toolService.createCategory(name, squad)
            .then((data) => {
                if(data.category && this.props.onCreate) {
                    this.props.onCreate(data.category);
                }
                this.setState({name: ''});
                this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_SQUAD_FORM.SUCCESS);
            }).catch((err) => {
                if(err === 'Conflict') {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.EXISTING);
                } else {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.INTERNAL_ERROR);
                }
            });
    }

    render() {
        const { submitted, name, isAdmin, forSquad, activeSquad } = this.state;
        return (
            <Form className='new-squad-form' onSubmit={ this.handleSubmit }>
                <Row form>
                    <Col md={{ size: 8, offset: 2}}>
                        <FormGroup>
                            <h5>Create new Tool category</h5>
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
                    {
                        isAdmin && activeSquad &&
                        <Col md={{ size: 5, offset: 3}}>
                            <FormGroup>
                                <Input
                                    type="checkbox"
                                    name="forSquad" value={forSquad}
                                    onChange={this.handleChange}/>
                                <Label>{`Is for the ${activeSquad.name} squad`}</Label>
                            </FormGroup>
                        </Col>
                    }
                </Row>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedNewToolCategoryForm = connect(mapStateToProps, mapDispatchToProps)(NewToolCategoryForm);
export default connectedNewToolCategoryForm;