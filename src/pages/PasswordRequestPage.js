import React from 'react';
import { Link } from 'react-router-dom';

import {Button, Form, FormGroup} from 'reactstrap';
import config from "../config";
import FloatingLabelInput from "../components/FloatingLabelInput";
import userMessages from '../_constants/userMessages.constants';
import OnePageForm from "../components/OnePageForm";

class PasswordRequestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            submitted: false,
            sent: false,
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
        const { email } = this.state;
        if (email) {
            this.requestNewPassword(email);
        }
    }


    requestNewPassword(email) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        };

        return fetch(`${config.apiUrl}/reset/request`, requestOptions)
            .then((response) => {
                return response.text().then(() => {
                    if (!response.ok) {
                        if (response.status === 409) {
                            this.setState({errorMessage: userMessages.PASSWORD_REQUEST.EXISTING});
                        } else {
                            this.setState({errorMessage: userMessages.PASSWORD_REQUEST.UNKNOWN});
                        }
                        return;
                    }
                    this.setState({ sent: true });
                });
            })
    }



    render() {
        const { email, submitted, sent } = this.state;
        return (
            <OnePageForm>
                {
                    sent ?
                    (
                        <Form name="form" onSubmit={this.handleSubmit}>
                            <div className="one-page-form__form">
                                <h3 className='text-center'>Reset your password</h3>
                            </div>
                            <Link to='/login'>Request sent</Link>
                        </Form>
                    )
                    :
                    (
                        <Form name="form" onSubmit={this.handleSubmit}>
                            <div>
                                <div className="one-page-form__form">
                                    <h3 className='text-center'>Reset your password</h3>
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
                                    <div className='one-page-form__error'>{this.state.errorMessage}</div>
                                </div>
                                <FormGroup className='text-center'>
                                    <Button className="btn">Reset</Button>
                                </FormGroup>
                            </div>
                        </Form>
                    )
                }
            </OnePageForm>

        );
    }
}

export default PasswordRequestPage;