import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {toolService} from "../_services/tool.service";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from "../_constants/userMessages.constants";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import Select from 'react-select'
import { singleSelect } from './../_styles/_select';
import options from './../_helpers/_font-awesome-options';

class NewToolForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            link: '',
            icon: 'ad',
            submitted: false,
            opened: false,
            iconOptions: options.map((option) => {
                return {
                    label: <span className={`fas fa-${option}`} />,
                    value: option
                };
            })
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    toggleOpen() {
        this.setState({opened: !this.state.opened})
    }

    handleSubmit(e) {
        e.preventDefault();
        const {name, link, icon} = this.state;
        if(!name || !link || !icon) return;

        toolService.createTool(this.props.categoryId, name, link, icon).then((data) => {
                if(data.tool && this.props.onCreate) {
                    this.props.onCreate(data.tool);
                }
                this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_TOOL_FORM.SUCCESS);
                this.setState({name: '', link: ''});
                this.toggleOpen();
            }).catch(() => {
                this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_TOOL_FORM.INTERNAL_ERROR);
            });
    }

    render() {
        const { submitted, name, link, opened, iconOptions } = this.state;
        const defaultOption = iconOptions[0];
        return (
            <>
                <div onClick={this.toggleOpen} className='tools__list__tool flex flex--column flex--center-center'>
                    <i className="fas fa-plus tools__list__tool__plus" />
                </div>
                {
                    opened &&
                    <div key='tool-form' className='tool-form flex flex--column flex--center-center'>
                        <div className='tool-form__form flex flex--center-center'>
                            <Form onSubmit={ this.handleSubmit }>
                                <Row form>
                                    <Col md={{ size: 12 }}>
                                        <FormGroup>
                                            <h5>Create new tool</h5>
                                        </FormGroup>
                                    </Col>

                                    <Col md={{ size: 12 }}>
                                        <FormGroup style={{zIndex: 100, position: 'relative'}}>
                                            <Select
                                                options={iconOptions}
                                                defaultValue={defaultOption}
                                                styles={singleSelect}
                                                onChange={(newVal) => {this.handleChange({target: {name: 'icon', value: newVal.value}})}}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={{ size: 12 }}>
                                        <FormGroup>
                                            <FloatingLabelInput
                                                type="text"
                                                label="Name"
                                                formClass={(submitted && !name ? 'has-error' : '')}
                                                name="name" value={name}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md={{ size: 12 }}>
                                        <FormGroup>
                                            <FloatingLabelInput
                                                type="text"
                                                label="Link"
                                                formClass={(submitted && !link ? 'has-error' : '')}
                                                name="link" value={link}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md={{ size: 12 }} className='text-right'>
                                        <FormGroup>
                                            <Button className="btn">Create</Button>
                                            <Button className="btn" onClick={this.toggleOpen}>Cancel</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                }
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedNewToolForm = connect(null, mapDispatchToProps)(NewToolForm);
export default connectedNewToolForm;
