import React, { Component } from 'react';
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import ProfilePhoto from "./ProfilePhoto";
import {bindActionCreators} from "redux";
import * as actionCreators from "../actions/actionCreator";

class Team extends Component {
    render() {
        return (
            <div className="team-list" onClick={this.props.incrementUserLike.bind(null, 1)}>
                {this.props.users.map((user, i) => {
                    return <ProfilePhoto key={user.id} src={user.profile} link={"/profile/" + user.id} alt={user.firstname + " " + user.lastname} i={i}/>
                })}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {users} = state;
    return {
        users
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const connectedTeam = connect(mapStateToProps, mapDispatchToProps)(Team);
export default connectedTeam;
