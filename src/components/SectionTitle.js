import React, { Component } from 'react';

const style = {
    marginBottom: '10px'
};

class SectionTitle extends Component {

    render() {
        return (
            <h2 className='section-title' style={style}>{ this.props.title }</h2>
        );
    }
}

export default SectionTitle;
