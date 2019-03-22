import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {singleSelect} from "../_styles/_select";
import Select from 'react-select'

import widthOption from './../_constants/chartModuleWidthOptions.constants';

class NewChartModuleForm extends Component {
    constructor(props) {
        super(props);

        let module = (this.props.module && this.props.module.type) ? this.props.module : {
            type: 'chart',
            properties: {
                xAxes: '',
                yAxes: '',
            }
        };

        this.state = {
            module,
            submitted: false,
            availableKpis: this.props.availableKpis
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
                type: 'chart',
                width: null,
                properties: {}
            },
            submitted: false
        });
        this.props.close();
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

        if(!module.title || (module.width === null || typeof module.width === "undefined") || !module.properties.kpi) return;
        this.props.onSubmit(module);
    }

    render() {
        const { submitted, module } = this.state;
        return (
            <Form className='new-module-form' onSubmit={ this.handleSubmit } onClick={(e) => e.stopPropagation()}>
                <Row form>
                    <Col md={{ size: 12}} className='text-center'>
                        <FormGroup>
                            <h5>Chart module</h5>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 12}}>
                        <FormGroup>
                            <FloatingLabelInput
                                type="text"
                                label="Title"
                                formClass={(submitted && !module.title ? 'has-error' : '')}
                                name="title" value={module.title}
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 6}}>
                        <FormGroup>
                            <label className="floating-form">Module width</label>
                            <Select
                                defaultValue={widthOption.filter(option => option.value === parseInt(module.width))}
                                options={widthOption}
                                onChange={(newVal) => {this.handleChange({target: {name: 'width', value: newVal.value}})}}
                                styles={singleSelect}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 6}}>
                        <FormGroup>
                            <label className="floating-form">KPI</label>
                            <Select
                                defaultValue={this.state.availableKpis.filter(kpi => kpi.value === module.properties.kpi)}
                                options={this.state.availableKpis}
                                onChange={(newVal) => {this.handlePropertiesChange({target: {name: 'kpi', value: newVal.value}})}}
                                styles={singleSelect}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 6}}>
                        <FormGroup>
                            <FloatingLabelInput
                                type="text"
                                label="X Axes"
                                name="xAxes" value={module.properties.xAxes}
                                onChange={this.handlePropertiesChange}/>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 6}}>
                        <FormGroup>
                            <FloatingLabelInput
                                type="text"
                                label="Y Axes"
                                name="yAxes" value={module.properties.yAxes}
                                onChange={this.handlePropertiesChange}/>
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

export default NewChartModuleForm;