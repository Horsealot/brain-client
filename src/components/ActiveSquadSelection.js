import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import {userService} from './../_services/user.service';

class ActiveSquadSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSquadName: userService.getCurrentSquadName()
        }
    }

    render() {
        const { authentication } = this.props;
        const { activeSquadName } = this.state;
        const hasMultipleSquads = authentication &&
                authentication.user &&
                authentication.user.squads &&
                authentication.user.squads.length >= 1;

        return (
            <div className='aside-menu__squad-selection'>
                { activeSquadName }
                { hasMultipleSquads &&
                    authentication.user.squads.map((squad) => (
                            <div key={squad.id}>{ squad.name }</div>
                        )
                    )
                }
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

const connectedActiveSquadSelection = connect(mapStateToProps, null)(ActiveSquadSelection);
export default connectedActiveSquadSelection;