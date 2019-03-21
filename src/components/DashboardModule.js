import React, { Component } from 'react';
import ChartModule from "./ChartModule";
import PeriodModule from "./PeriodModule";
import GoalModule from "./GoalModule";

class DashboardModule extends Component {
    constructor(props) {
        super(props);

        this.deleteModule = this.deleteModule.bind(this);
        this.editModule = this.editModule.bind(this);
    }

    deleteModule() {
        this.props.onDelete(this.props.module.id);
    }

    editModule() {
        this.props.onEdit(this.props.module.id);
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
        return (
        <div className={'dashboard-module module-' + module.width}>
            {this.props.editable &&
                <div className='dashboard-module__moderate flex flex--center-center'>
                    <div className='dashboard-module__moderate-edit' onClick={this.editModule}>
                        <i className="fas fa-edit"></i>
                    </div>
                    <div className='dashboard-module__moderate-remove' onClick={this.deleteModule}>X</div>
                </div>
            }
            <h5 className='text-center'>{module.title}</h5>
            <div>
                {this.renderComponent()}
            </div>
        </div>);
    }
}

export default DashboardModule;
