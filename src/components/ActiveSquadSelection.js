import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import {userService} from './../_services/user.service';
import {bindActionCreators} from "redux";
import {switchSquad} from "../actions/user.actions";

class ActiveSquadSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSquadName: userService.getCurrentSquadName(),
            squadSelectOpened: false
        }

        this.toggleSquadSelect = this.toggleSquadSelect.bind(this);
        this.switchSquad = this.switchSquad.bind(this);
    }

    toggleSquadSelect() {
        this.setState({squadSelectOpened: !this.state.squadSelectOpened});
    }

    switchSquad(newSquad) {
        this.props.switchSquad(newSquad);
        this.setState({squadSelectOpened: !this.state.squadSelectOpened});
        window.location.reload();
    }

    render() {
        const { authentication } = this.props;
        const { activeSquadName, squadSelectOpened } = this.state;
        const hasMultipleSquads = authentication &&
                authentication.user &&
                authentication.user.squads &&
                authentication.user.squads.length >= 1;

        return (
            <div className='aside-menu__squad-selection'>
                <div className='aside-menu__squad-selection__active' onClick={this.toggleSquadSelect}>{ activeSquadName }</div>
                { hasMultipleSquads && squadSelectOpened && (
                    <div className='aside-menu__squad-selection__list'>
                        <div className='aside-menu__squad-selection__list__title'>Change squad</div>
                        {
                            authentication.user.squads.map((squad) => (
                                    <div
                                        className={'aside-menu__squad-selection__list__squad ' + (squad.name === activeSquadName ? 'current' : '')}
                                        key={squad.id}
                                        onClick={() => this.switchSquad(squad)}
                                    >{ squad.name }</div>
                                )
                            )
                        }
                    </div>
                )}
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ switchSquad }, dispatch);
}


const connectedActiveSquadSelection = connect(mapStateToProps, mapDispatchToProps)(ActiveSquadSelection);
export default connectedActiveSquadSelection;