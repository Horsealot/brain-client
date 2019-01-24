import React from 'react';
import { Link } from 'react-router-dom';

import {Button, Col, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import config from "../../config";

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
                        if (response.status === 401) {
                            // auto logout if 401 response returned from api
                            // location.reload(true);
                        }

                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    }

                    return data;
                });
            })
    }



    render() {
        const { sending } = this.props;
        const { password, passwordConfirm, submitted, sent } = this.state;
        return (

            <Container className="col-md-6 col-md-offset-3">
                <h2>Request a new password</h2>
                {
                    sent ?
                        (
                            <Link to='/login'>Password reset, you can now Log in with your new password</Link>
                        )
                        :
                        (<Form name="form" onSubmit={this.handleSubmit}>
                            <FormGroup className={(submitted && !password ? ' has-error' : '')}>
                                <label htmlFor="password">Password</label>
                                <Input type="password" name="password" value={password} onChange={this.handleChange} />
                                {submitted && !password &&
                                <div className="help-block">Password is required</div>
                                }
                            </FormGroup>
                            <FormGroup className={(submitted && !passwordConfirm ? ' has-error' : '')}>
                                <label htmlFor="passwordConfirm">Password Confirmation</label>
                                <Input type="password" name="passwordConfirm" value={passwordConfirm} onChange={this.handleChange} />
                                {submitted && !passwordConfirm &&
                                <div className="help-block">Password confirmation is required</div>
                                }
                                {submitted && password && passwordConfirm && password !== passwordConfirm &&
                                <div className="help-block">Passwords does not match</div>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Button className="btn btn-primary">Reset my password</Button>
                                {sending &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </FormGroup>
                        </Form>)
                }
            </Container>
        );
    }
}

export default PasswordResetPage;