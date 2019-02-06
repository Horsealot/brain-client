import React from 'react';
import { connect } from 'react-redux';

import {bindActionCreators} from "redux";
import { login, logout } from "../actions/user.actions";

import {Button, Form, FormGroup} from 'reactstrap';

import FloatingLabelInput from '../components/FloatingLabelInput';

import {Link} from "react-router-dom";
import OnePageForm from "../components/OnePageForm";
import userMessages from '../_constants/userMessages.constants';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.logout();

        this.state = {
            email: '',
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
        const { email, password } = this.state;
        if (email && password) {
            this.props.login(email, password);
        }
    }

    render() {
        const { email, password, submitted } = this.state;
        return (
            <OnePageForm>
                <Form name="form" onSubmit={this.handleSubmit}>
                    <div className="one-page-form__form">
                        <FloatingLabelInput
                            type="text"
                            label="Email"
                            formClass={(submitted && !email ? 'has-error' : '')}
                            extrablock={
                                (submitted && !email) ?
                                (<div className="help-block">Email is required</div>) : undefined
                            }
                            name="email" value={email}
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
    return bindActionCreators({ login, logout }, dispatch);
}

const connectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export { connectedLoginPage as LoginPage };