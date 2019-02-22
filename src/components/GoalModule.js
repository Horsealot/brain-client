import React, { Component } from 'react';

class GoalModule extends Component {
    render() {
        const { module } = this.props;
        return <div>Goal module #{module.id}</div>;
    }
}

export default GoalModule;
