import React, { Component } from 'react';

class PeriodModule extends Component {
    render() {
        const { module } = this.props;
        return <div>Period module #{module.id}</div>;
    }
}

export default PeriodModule;
