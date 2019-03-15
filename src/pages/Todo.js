import React, { Component } from 'react';
import SectionTitle from "../components/SectionTitle";
import {todoService} from "../_services/todo.service";

import './../_styles/_components/_todo.scss';
import FullPageLoader from "../components/FullPageLoader";
import Task from "../components/Task";
import FullPageError from "../components/FullPageError";

class Todo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            tasks: null
        };
    }

    componentDidMount() {
        todoService.getTodo().then((data) => {
            this.setState({tasks: data.tasks, loaded: true});
        }).catch((err) => {
            this.setState({loaded: true, error: err});
        });
    }

    render() {
        const {loaded, tasks, error} = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        if(!tasks) {
            return (
                <FullPageError content={`${error.error}: ${error.details}`}/>
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
            </div>
        );
    }
}

export default Todo;
