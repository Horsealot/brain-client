import React, { Component } from 'react';

import {Link} from 'react-router-dom'

class Header extends Component {
    render() {
        return (
            <h1 className='brand-title'>
                <Link to="/">Brain</Link>
            </h1>
        );
    }
}

export default Header;
