import React, { Component } from 'react';

class NotFound extends Component {

    render() {
        return (
            <div className='notfound flex flex--center-center flex--column'>
                <img src='/assets/images/404.png' alt='Brain not found' title='Brain not found'/>
                <div className='notfound__label'>Looks like we lost ourself !</div>
            </div>
        );
    }
}

export default NotFound;
