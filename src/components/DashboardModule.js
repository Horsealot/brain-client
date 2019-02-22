import React, { Component } from 'react';
import ChartModule from "./ChartModule";
import PeriodModule from "./PeriodModule";
import GoalModule from "./GoalModule";

class DashboardModule extends Component {
    constructor(props) {
        super(props);

        this.deleteModule = this.deleteModule.bind(this);
    }

    deleteModule() {
        this.props.onDelete(this.props.module.id);
    }

    renderComponent() {
        switch (this.props.module.type) {
            case 'chart':
                return <ChartModule module={this.props.module} />;
            case 'goal':
                return <GoalModule module={this.props.module} />;
            case 'period':
                return <PeriodModule module={this.props.module} />;
            default:
                return <></>;
        }
    }

    render() {
        const { module } = this.props;
        return (<div className={'dashboard-module module-' + module.width}>
            <div className='dashboard-module__remove' onClick={this.deleteModule}>X</div>
            {this.renderComponent()}
        </div>);
    }
}

export default DashboardModule;
