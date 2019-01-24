import React from 'react';
import { connect } from 'react-redux';

import {bindActionCreators} from "redux";
import { login, logout } from "../../actions/actionCreator";

import {Button, Col, Container, Form, FormGroup, Input, Label} from 'reactstrap';

import FloatingLabelInput from './../FloatingLabelInput';

import './LoginPage.scss';

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
        const { email, password, submitted, loggingIn } = this.state;
        return (
            <div className='login-page flex flex--center-center'>
                <Container className="login-page__container">
                    <div className='text-center'>
                        <img className='login-page__logo' src='/assets/images/logo.png' title='Brain logo'/>
                    </div>
                    <Form name="form" onSubmit={this.handleSubmit}>
                        <div className="login-page__form">
                            <FloatingLabelInput
                                type="text"
                                label="Email"
                                formClass={(submitted && !email ? 'has-error' : '')}
                                extrablock={
                                    (submitted && !email) ?
                                    (<div className="help-block">Email is required</div>) : undefined
                                }
                                name="email" value={email}
                                value={this.state.value}
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
                                value={this.state.value}
                                onChange={this.handleChange}/>
                        </div>
                        {/*<FormGroup className={(submitted && !email ? ' has-error' : '')}>*/}
                            {/*<label htmlFor="email">Email</label>*/}
                            {/*<Input type="text" name="email" value={email} onChange={this.handleChange} />*/}

                        {/*</FormGroup>*/}
                        {/*<FormGroup className={(submitted && !password ? ' has-error' : '')}>*/}
                            {/*<label htmlFor="password">Password</label>*/}
                            {/*<Input type="password" name="password" value={password} onChange={this.handleChange} />*/}
                            {/*{submitted && !password &&*/}
                            {/*<div className="help-block">Password is required</div>*/}
                            {/*}*/}
                        {/*</FormGroup>*/}
                        <FormGroup className='text-center'>
                            <Button className="btn">Login</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggedUser } = state;
    return {
        loggedUser
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ login, logout }, dispatch);
}

const connectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export { connectedLoginPage as LoginPage };