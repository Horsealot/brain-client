import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import {squadService} from "../_services/squad.service";
import {userService} from "../_services/user.service";

class SquadAsanaProjectForm extends Component {
    constructor(props) {
        super(props);

        let activeSquad = userService.getActiveSquad();

        this.state = {
            projectId: activeSquad.asanaProjectId,
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
        const {projectId} = this.state;
        if(!projectId) return;

        return squadService.updateAsanaProjectId(projectId)
            .then((data) => {
                if(this.props.onUpdate) {
                    this.props.onUpdate(projectId);
                }
                this.props.displayAlert(alertConstants.SUCCESS, userMessages.SQUAD_ASANA_PROJECT_FORM.SUCCESS);
            }).catch((err) => {
                this.props.displayAlert(alertConstants.ERROR, userMessages.SQUAD_ASANA_PROJECT_FORM.INTERNAL_ERROR);
            });
    }

    render() {
        const { submitted, projectId } = this.state;
        if(!this.props.opened) {
            return <></>;
        }
        return (
            <div className='popup-form__backdrop' onClick={this.props.close}>
                <div className='popup-form' onClick={(e) => e.stopPropagation()}>
                    <Form className='squad-asana-project-form' onSubmit={ this.handleSubmit }>
                        <Row form>
                            <Col md={{ size: 8, offset: 2}}>
                                <FormGroup>
                                    <h5>Update squad Asana project</h5>
                                </FormGroup>
                            </Col>
                            <Col md={{ size: 8, offset: 2}}>
                                <FormGroup>
                                    <FloatingLabelInput
                                        type="text"
                                        label="ProjectId"
                                        formClass={(submitted && !projectId ? 'has-error' : '')}
                                        name="projectId" value={projectId}
                                        onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col md={{ size: 3, offset: 6}} className='text-right'>
                                <FormGroup>
                                    <Button className="btn">Update</Button>
                                </FormGroup>
                            </Col>
                            <Col md={{ size: 3}} className='text-right'>
                                <FormGroup>
                                    <Button onClick={this.props.close} className="btn">Cancel</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedSquadAsanaProjectForm = connect(null, mapDispatchToProps)(SquadAsanaProjectForm);
export default connectedSquadAsanaProjectForm;