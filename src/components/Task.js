import React, { Component } from 'react';

import './../_styles/_components/_task.scss';

class Task extends Component {
    render() {
        const {task} = this.props;
        return (
            <a href={`https://app.asana.com/0/0/${task.id}`} target='_blank' rel="noopener noreferrer">
                <div className='task'>
                    <div className='task__name'>
                        {task.name}
                    </div>
                    { task.assignee &&
                        <div className='task__assignee'>
                            {task.done ? `Done by ${task.assignee}` : `Assigned to ${task.assignee}`}
                        </div>
                    }
                </div>
            </a>
        );
    }
}

export default Task;
