import React from 'react';

import {Container} from 'reactstrap';
import {Link} from "react-router-dom";

class OnePageForm extends React.Component {
    render() {
        return (
            <div className='one-page-form flex flex--center-center'>
                <Container className="one-page-form__container">
                    <div className='text-center'>
                        <Link to='/'>
                            <img className='one-page-form__logo one-page-form__logo-brain' src='/assets/images/logo-brain.png' alt='Brain logo' title='Brain logo'/>
                            <img className='one-page-form__logo one-page-form__logo-bg' src='/assets/images/logo-background.png' alt='Brain logo background' title='Brain logo background'/>
                        </Link>
                    </div>
                    {this.props.children}
                </Container>
            </div>

        );
    }
}

export default OnePageForm;