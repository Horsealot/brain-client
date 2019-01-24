import React, { Component } from 'react';
import {Container} from "reactstrap";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')).user
        };
    }

    render() {
        return (
            <Container>
                <h1>Welcome on your dashboard</h1>
            </Container>
        );
    }
}

export default Dashboard;
