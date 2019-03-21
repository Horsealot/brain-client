import React, { Component } from 'react';
import {Button, Col, Container, Form, FormGroup, Row} from "reactstrap";
import FullPageLoader from "../components/FullPageLoader";
import DashboardModule from "../components/DashboardModule";
import NewModuleForm from "../components/NewModuleForm";
import {dashboardService} from "../_services/dashboard.service";
import './../_styles/_components/_dashboard.scss';
import {isAdminOrSquadAdmin} from "../_helpers/admin-validator";
import connect from "react-redux/es/connect/connect";
import NotFound from "../components/NotFound";
import {statusConstants} from './../_constants/status.constants';
import InternalError from "../components/InternalError";
import FloatingLabelInput from "../components/FloatingLabelInput";
import NewDashboardForm from "../components/NewDashboardForm";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: isAdminOrSquadAdmin(this.props.authentication.user),
            status: statusConstants.LOADING,
            modified: false,
            addModule: false,
            dashboard: null,
            editedModule: null,
            availableKpis: []
        };

        this.onDeleteModule = this.onDeleteModule.bind(this);
        this.toggleNewModuleForm = this.toggleNewModuleForm.bind(this);
        this.onNewModule = this.onNewModule.bind(this);
        this.reload = this.reload.bind(this);
    }

    componentDidMount() {
        this.reload();
        dashboardService.getAvailableKpis().then((data) => {
            this.setState({availableKpis: data.kpis});
        });
    }

    reload() {
        this.setState({status: statusConstants.LOADING});
        if(this.props.match.params.id) {
            dashboardService.getDashboard(this.props.match.params.id).then((data) => {
                if(!Array.isArray(data.dashboard.modules)) {
                    data.dashboard.modules = [];
                }
                this.setState({dashboard: data.dashboard, status: statusConstants.LOADED});
            });
        } else {
            dashboardService.getMyDashboard().then((data) => {
                if(!Array.isArray(data.dashboard.modules)) {
                    data.dashboard.modules = [];
                }
                this.setState({dashboard: data.dashboard, status: statusConstants.LOADED});
            }).catch((err) => {
                if(err.error === 'Not Found') {
                    this.setState({status: statusConstants.NOT_FOUND});
                } else {
                    this.setState({status: statusConstants.ERROR});
                }
            });
        }
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
        const { status, dashboard, addModule, isAdmin, editedModule } = this.state;
        if(status === statusConstants.LOADING) {
            return (<FullPageLoader />);
        }
        if(status === statusConstants.NOT_FOUND && !isAdmin) {
            return (<NotFound />);
        }
        if(status === statusConstants.ERROR) {
            return (<InternalError />);
        }
        return (
            <>
                { dashboard &&
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
                }
                { !dashboard &&
                    <Container>
                        <NewDashboardForm onCreated={this.reload}/>
                    </Container>
                }
            </>
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
