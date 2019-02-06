import React from 'react';

import {Button, Form, FormGroup} from 'reactstrap';
import config from "../config";
import OnePageForm from "../components/OnePageForm";
import FloatingLabelInput from "../components/FloatingLabelInput";
import userMessages from "../_constants/userMessages.constants";
import {history} from "../store";

class PasswordResetPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            passwordConfirm: '',
            submitted: false,
            errorMessage: null
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

        this.setState({ submitted: true });
        const { password, passwordConfirm } = this.state;
        if (password && passwordConfirm && password === passwordConfirm) {
            this.requestNewPassword(password);
        }
    }

    requestNewPassword(password) {
        const { token } = this.props.match.params;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        };

        return fetch(`${config.apiUrl}/reset`, requestOptions)
            .then((response) => {
                this.setState({ sent: true });
                return response.text().then((text) => {
                    const data = text && JSON.parse(text);
                    if (!response.ok) {
                        if (response.status === 410) {
                            this.setState({errorMessage: userMessages.PASSWORD_RESET.EXPIRED});
                        } else {
                            this.setState({errorMessage: userMessages.PASSWORD_RESET.UNKNOWN});
                        }
                        return;
                    }
                    history.push('/login');
                });
            })
    }



    render() {
        const { password, passwordConfirm, submitted } = this.state;
        return (

            <OnePageForm>
                <Form name="form" onSubmit={this.handleSubmit}>
                    <div className="one-page-form__form">
                        <h3 className='text-center'>Modify your password</h3>
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
                        <FloatingLabelInput
                            type="password"
                            label="Password confirmation"
                            formClass={(submitted && !passwordConfirm ? 'has-error' : '')}
                            extrablock={
                                (submitted && !passwordConfirm) ?
                                    (<div className="help-block">Password confirmation is required</div>) : (
                                (submitted && password !== passwordConfirm) ?
                                    (<div className="help-block">Passwords does not match</div>) : undefined)
                            }
                            name="passwordConfirm" value={passwordConfirm}
                            onChange={this.handleChange}/>
                        <div className='one-page-form__error'>{this.state.errorMessage}</div>
                    </div>
                    <FormGroup className='text-center'>
                        <Button className="btn">Confirm</Button>
                    </FormGroup>
                </Form>
            </OnePageForm>
        );
    }
}

export default PasswordResetPage;