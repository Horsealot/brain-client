import React, { Component } from 'react';

const style = {
    marginBottom: '50px'
};

class SectionTitle extends Component {

    render() {
        return (
            <h1 className='section-title' style={style}>{ this.props.title }</h1>
        );
    }
}

export default SectionTitle;
