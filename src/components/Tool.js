import React, { Component } from 'react';

class Tool extends Component {
    render() {
        const { tool } = this.props;
        return (
            <a href={tool.link} target='_blank' rel="noopener noreferrer" key={`${tool.id}`} className='tools__list__tool flex flex--column flex--center-center'>
                <i className={`fas fa-${tool.icon}`} />
                <div className='tools__list__tool__name text-center'>{ tool.name }</div>
            </a>
        );
    }
}

export default Tool;
