import React, { Component } from 'react';
import {Button, Container} from "reactstrap";
import FullPageLoader from "../components/FullPageLoader";
import DashboardModule from "../components/DashboardModule";
import NewModuleForm from "../components/NewModuleForm";
import {dashboardService} from "../_services/dashboard.service";
import './../_styles/_components/_dashboard.scss';
import {isAdminOrSquadAdmin} from "../_helpers/admin-validator";
import connect from "react-redux/es/connect/connect";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: isAdminOrSquadAdmin(this.props.authentication.user),
            loaded: false,
            modified: false,
            addModule: false,
            dashboard: null,
            editedModule: null,
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

    toggleNewModuleForm(module) {
        this.setState({editedModule: module, addModule: !this.state.addModule});
    }

    onNewModule(module) {
        let dashboard = {...this.state.dashboard};
        if(!module.stats) module.stats = [];
        let isANewModule = false;
        for(let i = 0; i < dashboard.modules.length; i++) {
            if(module.id === dashboard.modules[i].id) {
                isANewModule = true;
                dashboard.modules[i] = module;
            }
        }
        if(!isANewModule) {
            dashboard.modules.push(module);
        }
        this.setState({dashboard});
    }

    render() {
        const { dashboard, addModule, isAdmin, editedModule } = this.state;
        if(!this.state.loaded) {
            return (<FullPageLoader />);
        }
        return (
            <Container>
                <h1>{dashboard.name}</h1>
                <div className='dashboard'>
                    {
                        dashboard.modules.map((module) => (
                            <DashboardModule editable={isAdmin} key={module.id} module={module} onDelete={this.onDeleteModule} onEdit={() => this.toggleNewModuleForm(module)}/>
                        ))
                    }
                    { isAdmin &&
                        <div className='dashboard__new'>
                            <Button onClick={this.toggleNewModuleForm}>Add new module</Button>
                        </div>
                    }
                </div>
                {
                    addModule &&
                        <NewModuleForm
                            editedModule={editedModule}
                            onNewModule={(module) => this.onNewModule(module)}
                            close={this.toggleNewModuleForm}
                            availableKpis={this.state.availableKpis}
                            dashboardId={dashboard.id}/>
                }
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedDashboard = connect(mapStateToProps, null)(Dashboard);
export default connectedDashboard;
