import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import './../_styles/_components/_new_module_form.scss';
import {dashboardService} from "../_services/dashboard.service";
import NewChartModuleForm from "./NewChartModuleForm";
import NewPeriodModuleForm from "./NewPeriodModuleForm";

class NewModuleForm extends Component {
    constructor(props) {
        super(props);

        let module = (this.props.editedModule && this.props.editedModule.type) ? this.props.editedModule : {
            type: null
        };

        this.state = {
            module,
            availableKpis: this.props.availableKpis.map((kpi) => {
                return { value: kpi.kpi.id, label: kpi.kpi.name }
            })
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePropertiesChange = this.handlePropertiesChange.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({
            module: {
                title: null,
                type: null,
                width: null,
                properties: {}
            },
        });
        this.props.close();
    }

    selectType(type) {
        let module = {...this.state.module};
        module.type = type;
        this.setState({ module });
    }

    handleChange(e) {
        let module = {...this.state.module};
        const { name, value } = e.target;
        module[name] = value;
        this.setState({ module });
    }

    handlePropertiesChange(e) {
        let module = {...this.state.module};
        if(!module.properties) module.properties = {};
        const { name, value } = e.target;
        module.properties[name] = value;
        this.setState({ module });
    }

    handleSubmit(e, module) {
        if(e) {
            e.preventDefault();
        }

        if(!module) {
            module = this.state.module;
        }
        if(module.id) {
            return dashboardService.updateModule(this.props.dashboardId, module)
                .then((data) => {
                    if(data.module) {
                        this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_SQUAD_FORM.SUCCESS);
                        this.props.onNewModule(data.module);
                        this.close();
                    }
                }).catch((err) => {
                    if(err === 'Conflict') {
                        this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.EXISTING);
                    } else {
                        this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.INTERNAL_ERROR);
                    }
                });
        }
        return dashboardService.addModuleToDashboard(this.props.dashboardId, module)
            .then((data) => {
                if(data.module) {
                    this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_SQUAD_FORM.SUCCESS);
                    this.props.onNewModule(data.module);
                    this.close();
                }
            }).catch((err) => {
                if(err === 'Conflict') {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.EXISTING);
                } else {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_SQUAD_FORM.INTERNAL_ERROR);
                }
            });
    }

    render() {
        const { module } = this.state;
        return (
            <div className='new-module-form__backdrop' onClick={this.close}>
                {
                    module.type === 'chart' &&
                    (
                        <NewChartModuleForm module={module} availableKpis={this.state.availableKpis} onSubmit={(module) => {this.handleSubmit(null, module);}}/>
                    )
                }
                {
                    module.type === 'period' &&
                    (
                        <NewPeriodModuleForm module={module} availableKpis={this.state.availableKpis} onSubmit={(module) => {this.handleSubmit(null, module);}}/>
                    )
                }
                {
                    !module.type &&
                    (
                        <Form className='new-module-form' onClick={(e) => e.stopPropagation()}>
                            <Row form>
                                <Col md={{ size: 12}} className='text-center'>
                                    <FormGroup>
                                        <h5>Add new module</h5>
                                    </FormGroup>
                                </Col>
                                <Col md={{ size: 4}}>
                                    <FormGroup>
                                        <Button onClick={() => this.selectType("chart")}>Chart</Button>
                                    </FormGroup>
                                </Col>
                                <Col md={{ size: 4}}>
                                    <FormGroup>
                                        <Button onClick={() => this.selectType("period")}>Period</Button>
                                    </FormGroup>
                                </Col>
                                <Col md={{ size: 4}}>
                                    <FormGroup>
                                        <Button onClick={() => this.selectType("goal")}>Goal</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    )
                }
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedNewModuleForm = connect(null, mapDispatchToProps)(NewModuleForm);
export default connectedNewModuleForm;