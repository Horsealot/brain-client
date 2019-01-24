import React from 'react';
import { Link } from 'react-router-dom';

import {Button, Col, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import config from "../../config";

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
        const { email, submitted, sent } = this.state;
        return (

            <Container className="col-md-6 col-md-offset-3">
                <h2>Request a new password</h2>
                {
                    sent ?
                        (
                            <Link to='/login'>Request sent</Link>
                        )
                        :
                        (<Form name="form" onSubmit={this.handleSubmit}>
                            <FormGroup className={(submitted && !email ? ' has-error' : '')}>
                                <label htmlFor="username">Email</label>
                                <Input type="text" name="email" value={email} onChange={this.handleChange} />
                                {submitted && !email &&
                                <div className="help-block">Email is required</div>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Button className="btn btn-primary">Request</Button>
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

export default PasswordRequestPage;