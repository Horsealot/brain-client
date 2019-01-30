import React, { Component } from 'react';

class FullPageLoader extends Component {

    render() {
        return (
            <div className='loader-fullpage flex flex--center-center flex--column'>
                <img className='one-page-form__logo one-page-form__logo-bg' src='/assets/images/logo-background.png' alt='Brain logo background' title='Brain logo background'/>
            </div>
        );
    }
}

export default FullPageLoader;
