import React, { Component } from 'react';
import config from "../config";
import {Container} from "reactstrap";
import authHeader from "../_helpers/auth-header";
import { userService } from './../_services/user.service';
import SectionTitle from "./SectionTitle";
import {Link} from "react-router-dom";

class Squads extends Component {
    constructor(props) {
        super(props);

        this.state = {
            squads: {}
        };
    }

    componentDidMount() {
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };

        return fetch(`${config.apiUrl}/squads`, requestOptions)
            .then(userService.handleResponse)
            .then((data) => {
                this.setState({squads: data.squads});
            })
    }

    sortSquads() {
        const user = JSON.parse(localStorage.getItem('user'));
        let userSquads = user.squads;
        if(!userSquads) userSquads = new Array();
        let sortedSquads = {...this.state.squads};


    }

    buildTable = () => {
        let table = [];
        const { squads } = this.state;
        for(let squad in squads) {
            let squadMembers = [];
            for(let i = 0; i < squads[squad].length; i++) {
                const squadMember = squads[squad][i];
                squadMembers.push(
                    <Link to={`/profile/${squadMember._id}`} key={`${squad}.${squadMember._id}`} className='squads__members__member flex flex--column flex--center-center'>
                        {
                            squadMember.picture ?
                                <img src={squadMember.picture} className='squads__members__member__picture'/>
                                :
                                <img src='/assets/images/default-profile.jpg' className='squads__members__member__picture'/>
                        }
                        <div className='squads__members__member__name'>{ squadMember.firstname }</div>
                    </Link>
                );
            }
            table.push(
                <div key={`${squad}`} className='squads'>
                    <h3 className='squads__title'>{ squad }</h3>
                    <div className='squads__members flex flex--start-center flex--wrap'>
                        { squadMembers }
                    </div>
                </div>
            );
        }
        return table;
    }

    render() {
        const { squads } = this.state;
        return (
            <Container>
                <SectionTitle title='Brain squads'/>
                { this.buildTable() }
            </Container>
        );
    }
}

export default Squads;
