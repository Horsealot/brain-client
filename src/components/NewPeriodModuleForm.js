import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import ModuleFormButton from "./ModuleFormButton";
import {singleSelect} from "../_styles/_select";
import Select from 'react-select'
import shortid from 'shortid';

import widthOption from './../_constants/chartModuleWidthOptions.constants';

class NewPeriodModuleForm extends Component {
    constructor(props) {
        super(props);

        let module = {...this.props.module};
        if(!Array.isArray(module.properties)) {
            module.properties = [];
        }

        module.properties.map((property) => {
            return {
                ...property,
                id: shortid.generate()
            };
        })

        this.state = {
            module,
            submitted: false,
            availableKpis: this.props.availableKpis
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addKPI = this.addKPI.bind(this);
        this.removeKPI = this.removeKPI.bind(this);
        this.handlePropertiesChange = this.handlePropertiesChange.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({
            module: {
                title: null,
                type: 'period',
                width: null,
                properties: [],
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

    handlePropertiesChange(index, name, value) {
        let module = {...this.state.module};
        if(index >= module.properties.length) return;
        module.properties[index][name] = value;
        this.setState({ module });
    }

    addKPI() {
        let module = {...this.state.module};
        module.properties.push({
            id: shortid.generate(),
            kpi: null,
            title: null
        });
        this.setState({ module });
    }

    removeKPI(index) {
        let module = {...this.state.module};
        module.properties.splice(index, 1);
        this.setState({ module });
    }

    handleSubmit(e) {
        e.preventDefault();

        const {module} = this.state;

        if(!module.title || (module.width === null || typeof module.width === "undefined") || !module.properties.length) return;

        module.properties.filter(property => (property.kpi && property.title));
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
                        <FloatingLabelInput
                            type="text"
                            label="Module Title"
                            formClass={(submitted && !module.title ? 'has-error' : '')}
                            name="title" value={module.title}
                            onChange={this.handleChange}/>
                    </Col>
                    <Col md={{ size: 12}}>
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
                    {
                        module.properties.map((property, index) =>
                            <Col key={property.id} md={{ size: 12}}>
                                <Row>
                                    <Col md={{ size: 6}}>
                                        <FloatingLabelInput
                                            type="text"
                                            label="Title"
                                            name="title" value={property.title}
                                            onChange={(e) => {this.handlePropertiesChange(index, 'title', e.target.value)}}/>
                                    </Col>
                                    <Col md={{ size: 6}}>
                                        <FormGroup>
                                            <Select
                                                placeholder={'Select KPI'}
                                                defaultValue={this.state.availableKpis.filter(kpi => kpi.value === property.kpi)}
                                                options={this.state.availableKpis}
                                                onChange={(newVal) => {this.handlePropertiesChange(index, 'kpi', newVal.value)}}
                                                styles={singleSelect}
                                            />
                                            <i onClick={() => this.removeKPI(index)} className="new-module-form__period__remove fas fa-times"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        )
                    }
                    <Col md={{ size: 12}}>
                        <FormGroup>
                            <Button onClick={this.addKPI}>Add new KPI</Button>
                        </FormGroup>
                    </Col>
                    <Col md={{ size: 3}} className='text-right'>
                        <FormGroup>
                            <ModuleFormButton module={module}/>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default NewPeriodModuleForm;