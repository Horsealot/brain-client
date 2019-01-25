import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from "redux";
import { signup, logout } from "../../actions/user.actions";

import {Button, Form, FormGroup} from 'reactstrap';

import FloatingLabelInput from './../FloatingLabelInput';

import {Link} from "react-router-dom";
import OnePageForm from "./../OnePageForm";
import userMessages from './../../_constants/userMessages.constants';

class SignupPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.logout();

        this.state = {
            firstname: '',
            lastname: '',
            password: '',
            submitted: false,
            loggingIn: true
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

        this.setState({ submitted: true, loggingIn: true });
        const { firstname, lastname, password } = this.state;
        const { token } = this.props.match.params;
        if (firstname && lastname && password) {
            this.props.signup(token, password, firstname, lastname);
        }
    }

    render() {
        const { firstname, lastname, password, submitted } = this.state;
        return (
            <OnePageForm>
                <Form name="form" onSubmit={this.handleSubmit}>
                    <div className="one-page-form__form">
                        <FloatingLabelInput
                            type="text"
                            label="Firstname"
                            formClass={(submitted && !firstname ? 'has-error' : '')}
                            extrablock={
                                (submitted && !firstname) ?
                                    (<div className="help-block">Firstname is required</div>) : undefined
                            }
                            name="firstname" value={firstname}
                            onChange={this.handleChange}/>
                        <FloatingLabelInput
                            type="text"
                            label="Lastname"
                            formClass={(submitted && !lastname ? 'has-error' : '')}
                            extrablock={
                                (submitted && !lastname) ?
                                    (<div className="help-block">Lastname is required</div>) : undefined
                            }
                            name="lastname" value={lastname}
                            onChange={this.handleChange}/>
                        <FloatingLabelInput
                            type="password"
                            label="Password"
                            formClass={(submitted && !password ? 'has-error' : '')}
                            extrablock={
                                (submitted && !password) ?
                                    (<div className="help-block">Password is required</div>) : undefined
                            }
                            name="password" value={password}
                            onChange={this.handleChange}/>
                        <div className='one-page-form__error'>{userMessages[this.props.authentication.error]}</div>
                    </div>
                    <FormGroup className='text-center'>
                        <Button className="btn">Login</Button>
                        <div>
                            <Link to='/password/request' className='one-page-form__sub-action'>
                                Lost your password ?
                            </Link>
                        </div>
                    </FormGroup>
                </Form>
            </OnePageForm>
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
    return bindActionCreators({ signup, logout }, dispatch);
}

const connectedSignupPage = connect(mapStateToProps, mapDispatchToProps)(SignupPage);
export { connectedSignupPage as SignupPage };