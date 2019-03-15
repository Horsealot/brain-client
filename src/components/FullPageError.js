import React, { Component } from 'react';
import {Container} from "reactstrap";

class FullPageError extends Component {
    render() {
        return (
            <Container className='text-center' style={{
                fontSize: '30px',
                color: '#b60000'
            }}>
                {this.props.content}
            </Container>);
    }
}

export default FullPageError;
