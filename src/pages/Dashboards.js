import React, { Component } from 'react';
import {Button, Container} from "reactstrap";
import FullPageLoader from "../components/FullPageLoader";
import DashboardModule from "../components/DashboardModule";
import NewModuleForm from "../components/NewModuleForm";
import {dashboardService} from "../_services/dashboard.service";
import './../_styles/_components/_dashboard.scss';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            modified: false,
            addModule: false,
            dashboard: null,
            availableKpis: []
        };

        this.onDeleteModule = this.onDeleteModule.bind(this);
        this.toggleNewModuleForm = this.toggleNewModuleForm.bind(this);
        this.onNewModule = this.onNewModule.bind(this);
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            dashboardService.getDashboard(this.props.match.params.id).then((data) => {
                if(!Array.isArray(data.dashboard.modules)) {
                    data.dashboard.modules = [];
                }
                this.setState({dashboard: data.dashboard, loaded: true});
            });
        } else {

            dashboardService.getMyDashboard().then((data) => {
                if(!Array.isArray(data.dashboard.modules)) {
                    data.dashboard.modules = [];
                }
                this.setState({dashboard: data.dashboard, loaded: true});
            });
        }
        dashboardService.getAvailableKpis().then((data) => {
            this.setState({availableKpis: data.kpis});
        });
    }

    onDeleteModule(moduleId) {
        let dashboard = {...this.state.dashboard};
        for(let i = 0; i < this.state.dashboard.modules.length; i++) {
            if(this.state.dashboard.modules[i].id === moduleId) {
                dashboard.modules.splice(i, 1);
            }
        }

        dashboardService.removeModuleToDashboard(this.state.dashboard.id, moduleId).then(() => {
        });
        this.setState({dashboard});
    }

    toggleNewModuleForm() {
        this.setState({addModule: !this.state.addModule});
    }

    onNewModule(module) {
        let dashboard = {...this.state.dashboard};
        if(!module.stats) module.stats = [];
        dashboard.modules.push(module);
    }

    render() {
        const { dashboard, addModule } = this.state;
        if(!this.state.loaded) {
            return (<FullPageLoader />);
        }
        return (
            <Container>
                <h1>{dashboard.name}</h1>
                <div className='dashboard'>
                    {
                        dashboard.modules.map((module) => (
                            <DashboardModule key={module.id} module={module} onDelete={this.onDeleteModule}/>
                        ))
                    }
                    <div className='dashboard__new'>
                        <Button onClick={this.toggleNewModuleForm}>Add new module</Button>
                    </div>
                </div>
                {
                    addModule &&
                        <NewModuleForm
                            onNewModule={(module) => this.onNewModule(module)}
                            close={this.toggleNewModuleForm}
                            availableKpis={this.state.availableKpis}
                            dashboardId={dashboard.id}/>
                }
            </Container>
        );
    }
}

export default Dashboard;
