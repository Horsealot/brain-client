import React, { Component } from 'react';
import SectionTitle from "../components/SectionTitle";
import {todoService} from "../_services/todo.service";

import './../_styles/_components/_todo.scss';
import FullPageLoader from "../components/FullPageLoader";
import Task from "../components/Task";
import FullPageError from "../components/FullPageError";
import SquadAsanaProjectForm from "../components/SquadAsanaProjectForm";
import {Button} from "reactstrap";
import {userService} from "../_services/user.service";
import {isAdminOrSquadAdmin} from "../_helpers/admin-validator";
import connect from "react-redux/es/connect/connect";

class Todo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: isAdminOrSquadAdmin(this.props.authentication.user),
            inEdition: false,
            loaded: false,
            tasks: null
        };
        this.toggleEditionModal = this.toggleEditionModal.bind(this);
        this.editProjectId = this.editProjectId.bind(this);
        this.loadTodo = this.loadTodo.bind(this);
    }

    componentDidMount() {
        this.loadTodo();
    }

    loadTodo() {
        todoService.getTodo().then((data) => {
            this.setState({tasks: data.tasks, loaded: true});
        }).catch((err) => {
            this.setState({loaded: true, error: err});
        });
    }

    toggleEditionModal() {
        this.setState({inEdition: !this.state.inEdition});
    }

    editProjectId(newProjectId) {
        this.toggleEditionModal();
        if(newProjectId) {
            let activeSquad = userService.getActiveSquad();
            activeSquad.asanaProjectId = newProjectId;
            userService.setActiveSquad(activeSquad);
            this.setState({loaded: false, tasks: null});
            this.loadTodo();
        }
    }

    render() {
        const {loaded, tasks, inEdition, isAdmin, error} = this.state;

        const editionPart = isAdmin ? (
            <>
                <SquadAsanaProjectForm close={this.toggleEditionModal} onUpdate={(data) => {this.editProjectId(data);}} opened={inEdition}/>
                <Button onClick={this.toggleEditionModal}>Edit</Button>
            </>
        ) : <></>;

        if(!loaded) {
            return (<FullPageLoader />);
        }
        if(!tasks) {
            return (
                <>
                    <FullPageError content={`${error.error}: ${error.details}`}/>
                    {editionPart}
                </>
            )
        }
        return (
            <div className='container-large'>
                <SectionTitle title='My squad todo'/>
                <div className='flex flex--space-between-start todos'>
                    <div className='todos__todo'>
                        <div className='todos__todo__title'>
                            Todo
                        </div>
                        { tasks.todo.map((task) =>
                            <Task key={task.id} task={task}/>
                        )}
                    </div>
                    <div className='todos__todo'>
                        <div className='todos__todo__title'>
                            In progress
                        </div>
                        { tasks.inProgress.map((task) =>
                            <Task key={task.id} task={task}/>
                        )}
                    </div>
                    <div className='todos__todo'>
                        <div className='todos__todo__title'>
                            Done
                        </div>
                        { tasks.done.map((task) =>
                            <Task key={task.id} task={task}/>
                        )}
                    </div>
                </div>
                {editionPart}
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedTodo = connect(mapStateToProps, null)(Todo);
export default connectedTodo;
