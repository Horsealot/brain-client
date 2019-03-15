import React, { Component } from 'react';
import {Container, Input} from "reactstrap";
import {goalService} from "../_services/goal.service";

import './../_styles/_components/_user_goals.scss';
import connect from "react-redux/es/connect/connect";
import {getUserPicture} from "../_helpers/user-picture";
import FullPageLoader from "./FullPageLoader";

class UserGoals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newGoal: '',
            userGoals: [],
            loaded: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleGoalSubmit = this.handleGoalSubmit.bind(this);
        this.focusGoal = this.focusGoal.bind(this);
        this.resetFocus = this.resetFocus.bind(this);
    }

    handleGoalChange(e, goal) {
        let userGoals = [...this.state.userGoals];
        const { value } = e.target;
        userGoals.forEach((userGoal) => {
            if(userGoal.id === goal.id) userGoal.value = value;
        });
        this.setState({ userGoals });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    focusGoal(goal) {
        this.resetFocus();
        let userGoals = [...this.state.userGoals];
        userGoals.forEach((userGoal) => {
            if(userGoal.id === goal.id) goal.focus = !userGoal.focus;
        });
        this.setState({ userGoals });
    }

    resetFocus() {
        let userGoals = [...this.state.userGoals];
        userGoals.forEach((userGoal) => {
            userGoal.focus = false;
        });
        this.setState({ userGoals });
    }

    handleGoalSubmit(e, goal) {
        if(e.key === 'Enter'){
            if(goal && goal.id) {
                goalService.updateGoal(goal.id, goal.value).then((data) => {
                    this.resetFocus();
                });
            } else {
                goalService.addGoal(this.state.newGoal).then((data) => {
                    let newUserGoals = [...this.state.userGoals];
                    newUserGoals.push({...data.goal, focus: false});
                    this.setState({userGoals: newUserGoals, newGoal: ''});
                });
            }
        }
    }

    deleteGoal(goal) {
        goalService.deleteGoal(goal.id).then((data) => {
            this.resetFocus();
            let userGoals = [...this.state.userGoals];
            let index=-1;
            userGoals.forEach((userGoal, i) => {
                if(userGoal.id === goal.id) {
                    index = i;
                }
            });
            if(index>=0) {
                userGoals.splice(index, 1);
            }
            this.setState({userGoals});
        });
    }

    componentDidMount() {
        goalService.getMyGoals().then((data) => {
            this.setState({
                userGoals: data.goals.map((goal) => {
                    return {...goal, focus: false};
                }),
                loaded: true
            });
        });
    }

    renderUserGoals() {
        let goals = [];
        const { loaded, userGoals } = this.state;
        if(loaded) {
            userGoals.forEach((goal) => {
                goals.push((
                    <div key={goal.id} onClick={(e) => e.stopPropagation()} className='user-goals__goal flex flex--start-center'>
                        {
                            !goal.focus &&
                            <div onClick={(e) => this.focusGoal(goal)}>{ goal.value }</div>
                        }
                        {
                            goal.focus &&
                            <Input
                                onKeyPress={(e) => this.handleGoalSubmit(e, goal)}
                                type="text"
                                placeholder="New goal"
                                id={goal.id} value={goal.value}
                                onChange={(e) => this.handleGoalChange(e, goal)}
                            />
                        }
                        <i className="fas fa-window-close user-goals__goal__close" onClick={() => this.deleteGoal(goal)}/>
                    </div>
                ));
            });
        }
        return goals;
    }

    render() {
        const { loaded, userGoals, newGoal } = this.state;
        const { user } = this.props.authentication;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        return (
            <Container onClick={this.resetFocus}>
                <h3>What I need to improve personaly and how</h3>
                <div className='user-goals flex flex--center-center'>
                    <div className='flex flex--center-center'>
                        <img className='user-goals__picture' alt={user.firstname} onClick={this.toggleMenu} src={getUserPicture(user)}/>
                    </div>
                    <div className='flex--grow flex flex--column'>
                        {this.renderUserGoals()}
                        <div className='user-goals__goal flex flex--start-center'>
                            <Input
                                onKeyPress={(e) => this.handleGoalSubmit(e)}
                                type="text"
                                placeholder="New goal"
                                name="newGoal" value={newGoal}
                                onChange={this.handleChange}
                            />
                            {/*<FloatingLabelInput*/}
                                {/*onKeyPress={(e) => this.handleNewGoal(e)}*/}
                                {/*type="text"*/}
                                {/*label="Title"*/}
                                {/*name="newGoal" value={newGoal}*/}
                                {/*onChange={this.handleChange}/>*/}
                        </div>
                    </div>
                </div>
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

const connectedUserGoals = connect(mapStateToProps, null)(UserGoals);
export default connectedUserGoals;
