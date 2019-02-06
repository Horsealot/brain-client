import React, { Component } from 'react';

class NotFound extends Component {

    render() {
        return (
            <div className='notfound flex flex--center-center flex--column'>
                <img src='/assets/images/401.png' alt='Brain not allowed' title='Brain not allowed'/>
                <div className='notfound__label'>You should not be here !</div>
            </div>
        );
    }
}

export default NotFound;
