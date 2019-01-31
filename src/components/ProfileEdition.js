import React, { Component } from 'react';
import {Button, Container, Form, FormGroup} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import authHeader from "../_helpers/auth-header";
import config from "../config";
import DatePicker from "react-datepicker";
import PhoneInput from 'react-phone-number-input';

import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-number-input/style.css';

import FloatingTextareaInput from "./FloatingTextareaInput";
import {isAdmin} from "../_helpers/admin-validator";
import SquadSelect from "./SquadSelect";
import RoleSelect from "./RoleSelect";
import {bindActionCreators} from "redux";
import {updateUser} from "../actions/user.actions";
import {displayAlert} from '../actions/alert.actions';
import connect from "react-redux/es/connect/connect";
import {userService} from "../_services/user.service";

import { alertConstants } from './../_constants/alert.constants';

class Profile extends Component {
    constructor(props) {
        super(props);

        const user = {...this.props.user};
        if(user.birthdate) {
            user.birthdate = new Date(Date.parse(user.birthdate));
        }

        this.state = {
            user,
            isOwner: (user._id === JSON.parse(localStorage.getItem('user'))._id),
            isAdmin: isAdmin(),
            userError: {},
            submitted: false
        };
        this.fileUpload = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.onPictureChange = this.onPictureChange.bind(this);
        this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderLabelInput = this.renderLabelInput.bind(this);
        this.renderTextareaInput = this.renderTextareaInput.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);
        this.close = this.close.bind(this);
    }

    handleChange(e) {
        let userCopy = Object.assign({}, this.state.user);
        const { name, value } = e.target;
        userCopy[name] = value;
        this.setState({ user: userCopy });
    }
    handleBirthdateChange(date) {
        let userCopy = Object.assign({}, this.state.user);
        userCopy.birthdate = date;
        this.setState({user: userCopy});
    }
    handlePhoneNumberChange(number) {
        let userCopy = Object.assign({}, this.state.user);
        userCopy.phoneNumber = number;
        this.setState({user: userCopy});
    }

    triggerFileUpload() {
        this.fileUpload.current.click();
    }

    close(e) {
        this.props.editionCompleted();
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });

        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({user: this.state.user})
        };

        return fetch(`${config.apiUrl}/users/${this.state.user._id}`, requestOptions)
            .then(userService.handleResponse)
            .then((data) => {
                let updatedUser = {};
                for (let key in data.user) {
                    if(data.user[key] === 'updated') {
                        updatedUser[key] = this.state.user[key];
                    }
                }
                if(this.state.isOwner) {
                    this.props.updateUser(updatedUser);
                }
                this.props.editionCompleted();
                this.props.displayAlert(alertConstants.SUCCESS, 'User saved');
            }).catch((error) => {
                this.props.displayAlert(alertConstants.ERROR, `Internal error occured [${error}]`);
            });
    }

    renderLabelInput(key, label) {
        const { user, submitted } = this.state;
        return (
            <FloatingLabelInput
                type="text"
                label={label}
                formClass={(submitted && !user[key] ? 'has-error' : '')}
                extrablock={
                    (submitted && !user[key]) ?
                        (<div className="help-block">{ label } is required</div>) : undefined
                }
                name={key} value={user[key]}
                onChange={this.handleChange}/>
        )
    }
    renderTextareaInput(key, label) {
        const { user, submitted } = this.state;
        return (
            <FloatingTextareaInput
                type="text"
                label={label}
                formClass={(submitted && !user[key] ? 'has-error' : '')}
                extrablock={
                    (submitted && !user[key]) ?
                        (<div className="help-block">{ label } is required</div>) : undefined
                }
                name={key} value={user[key]}
                onChange={this.handleChange}/>
        )
    }
    onPictureChange = e => {
        const files = Array.from(e.target.files)

        const formData = new FormData();

        files.forEach((file, i) => {
            formData.append(i, file)
        })

        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader()},
            body: formData
        };

        fetch(`${config.apiUrl}/uploads/picture`, requestOptions)
            .then(res => res.json())
            .then(image => {
                this.handleChange({target: {name: 'picture', value: image.url}});
            }).catch((err) => {

            });
    }

    render() {
        const { user, isAdmin, isOwner } = this.state;

        const adminForm = (
            <div className='row profile-edition__block'>
                <div className='col-sm-12'>
                    { this.renderLabelInput('jobTitle', 'Job title') }
                </div>
                <div className='col-sm-12'>
                    { this.renderTextareaInput('scorecard', 'scorecard') }
                </div>
                <div className='col-sm-6'>
                    <label className="floating-form">Squads</label>
                    <SquadSelect
                        selectKey={0}
                        value={user.squads}
                        onBlur={() => {}}
                        onChange={(value) => {
                            const e = {target: {name: 'squads', value}};
                            this.handleChange(e);
                        }}
                    />
                </div>
                <div className='col-sm-6'>
                    <label className="floating-form">Roles</label>
                    <RoleSelect
                        selectKey={0}
                        value={user.roles}
                        onBlur={() => {}}
                        onChange={(value) => {
                            const e = {target: 'roles', value};
                            this.handleChange(e);
                        }}
                    />
                </div>
                { !isOwner &&
                    <div className='col-sm-6'>
                        <div className="floating-form form-group">
                            <label className="is-focused floating-form">Phone number</label>
                            <PhoneInput
                                className='form-control'
                                placeholder=''
                                value={ user.phoneNumber }
                                onChange={ this.handlePhoneNumberChange } />
                        </div>
                    </div>
                }
            </div>
        );

        const ownerForm = (
            <div className='row profile-edition__block'>
                <div className='col-sm-12 text-center'>
                    <img src={user.picture} onClick={this.triggerFileUpload} className='profile__avatar' alt={user.firstname + ' ' + user.lastname}/>

                    <div style={{'display': 'none'}}>
                        <input className='btn btn-secondary' type='file' id='single' ref={this.fileUpload} onChange={this.onPictureChange} />
                    </div>
                </div>
                <div className='col-sm-6'>
                    { this.renderLabelInput('firstname', 'Firstname') }
                </div>
                <div className='col-sm-6'>
                    { this.renderLabelInput('lastname', 'Lastname') }
                </div>
                <div className='col-sm-12'>
                    { this.renderTextareaInput('description', 'Description') }
                </div>
                <div className='col-sm-6'>
                    <div className="floating-form form-group">
                        <label className="is-focused floating-form">Birthday</label>
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            className='form-control'
                            name='birthdate'
                            selected={ user.birthdate }
                            onChange={this.handleBirthdateChange}
                        />
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="floating-form form-group">
                        <label className="is-focused floating-form">Phone number</label>
                        <PhoneInput
                            className='form-control'
                            placeholder=''
                            value={ user.phoneNumber }
                            onChange={ this.handlePhoneNumberChange } />
                    </div>
                </div>
            </div>
        );

        return (
            <Container>
                <Form name="form" className='profile-edition flex flex--start-center flex--column' onSubmit={this.handleSubmit}>
                    {
                        isOwner && ownerForm
                    }
                    {
                        isAdmin && adminForm
                    }
                    <div className='form-inline text-center'>
                        <FormGroup className='profile-edition__call-to-action'>
                            <Button>Save</Button>
                        </FormGroup>
                        <FormGroup className='profile-edition__call-to-action'>
                            <Button onClick={this.close}>Cancel</Button>
                        </FormGroup>
                    </div>
                </Form>
            </Container>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateUser, displayAlert }, dispatch);
}

const connectedProfile = connect(null, mapDispatchToProps)(Profile);
export default connectedProfile;
