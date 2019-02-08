import React, { Component } from 'react';
import {Container} from "reactstrap";
import SectionTitle from "./SectionTitle";
import {Link} from "react-router-dom";
import {getUserPicture} from "../_helpers/user-picture";
import {squadService} from "../_services/squad.service";

class Squads extends Component {
    constructor(props) {
        super(props);

        this.state = {
            squads: {}
        };
    }

    componentDidMount() {
        squadService.getSquads().then((data) => {
            this.setState({squads: data.squads});
        });
    }

    buildTable = () => {
        let table = [];
        const { squads } = this.state;
        for(let squad in squads) {
            let squadMembers = [];
            for(let i = 0; i < squads[squad].length; i++) {
                const squadMember = squads[squad][i];
                squadMembers.push(
                    <Link to={`/profile/${squadMember.id}`} key={`${squad}.${squadMember.id}`} className='squads__members__member flex flex--column flex--center-center'>
                        <img src={getUserPicture(squadMember)} alt={squadMember.firstname} className='squads__members__member__picture'/>
                        <div className='squads__members__member__name'>{ squadMember.firstname }</div>
                        <div className='squads__members__member__job'>{ squadMember.jobTitle }</div>
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
    };

    render() {
        return (
            <Container>
                <SectionTitle title='Brain squads'/>
                { this.buildTable() }
            </Container>
        );
    }
}

export default Squads;
