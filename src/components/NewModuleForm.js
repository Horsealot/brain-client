import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import './../_styles/_components/_new_module_form.scss';
import {singleSelect} from "../_styles/_select";
import Select from 'react-select'
import {dashboardService} from "../_services/dashboard.service";

const widthOption = [
    { value: 0, label: 'Full width' },
    { value: 1, label: '1/3' },
    { value: 2, label: '1/2' }
];

class NewModuleForm extends Component {
    constructor(props) {
        super(props);

        let module = (this.props.editedModule && this.props.editedModule.type) ? this.props.editedModule : {
            type: null,
            properties: {}
        };
        console.log(module);

        this.state = {
            module,
            // module: {
            //     type: null,
            //     properties: {}
            // },
            submitted: false,
            availableKpis: this.props.availableKpis.map((kpi) => {
                return { value: kpi.kpi.id, label: kpi.kpi.name }
            })
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePropertiesChange = this.handlePropertiesChange.bind(this);
        this.close = this.close.bind(this);
        // this.selectType = this.selectType.bind(this);
    }

    close() {
        this.setState({
            module: {
                title: null,
                type: null,
                width: null,
                properties: {}
            },
            submitted: false
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

    handleSubmit(e) {
        e.preventDefault();

        const {module} = this.state;
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
        const { submitted, module } = this.state;
        return (
            <div className='new-module-form__backdrop' onClick={this.close}>
                <Form className='new-module-form' onSubmit={ this.handleSubmit } onClick={(e) => e.stopPropagation()}>
                    <Row form>
                        <Col md={{ size: 12}} className='text-center'>
                            <FormGroup>
                                <h5>Add new module</h5>
                            </FormGroup>
                        </Col>
                        {
                            !module.type &&
                                (
                                    <>
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
                                    </>
                                )
                        }
                        {
                            module.type === 'chart' &&
                                (
                                    <>
                                        <Col md={{ size: 4}}>
                                            <FormGroup>
                                                <FloatingLabelInput
                                                    type="text"
                                                    label="Title"
                                                    formClass={(submitted && !module.title ? 'has-error' : '')}
                                                    name="title" value={module.title}
                                                    onChange={this.handleChange}/>
                                            </FormGroup>
                                        </Col>
                                        <Col md={{ size: 4}}>
                                            <FormGroup>
                                                <Select
                                                    defaultValue={widthOption.filter(option => option.value === parseInt(module.width))}
                                                    options={widthOption}
                                                    onChange={(newVal) => {this.handleChange({target: {name: 'width', value: newVal.value}})}}
                                                    styles={singleSelect}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={{ size: 4}}>
                                            <FormGroup>
                                                <Select
                                                    defaultValue={this.state.availableKpis.filter(kpi => kpi.value === module.properties.kpi)}
                                                    options={this.state.availableKpis}
                                                    onChange={(newVal) => {this.handlePropertiesChange({target: {name: 'kpi', value: newVal.value}})}}
                                                    styles={singleSelect}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </>
                                )
                        }
                        {
                            module.type &&
                            <Col md={{ size: 3}} className='text-right'>
                                <FormGroup>
                                    <Button className="btn">Create</Button>
                                </FormGroup>
                            </Col>
                        }
                    </Row>
                </Form>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedNewModuleForm = connect(null, mapDispatchToProps)(NewModuleForm);
export default connectedNewModuleForm;